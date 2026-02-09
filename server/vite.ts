import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  // Dynamic import to avoid loading vite in production
  const { createServer: createViteServer, createLogger } = await import("vite");

  const viteLogger = createLogger();

  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    server: serverOptions,
    appType: "custom",
    configFile: path.resolve(__dirname, "..", "vite.config.ts"),
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      // Apply Vite HTML transforms
      template = await vite.transformIndexHtml(url, template);

      // Load the server entry
      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");

      // Render the app
      const { html: appHtml } = await render(url);

      // Inject into template
      const html = template.replace(
        /<div id="root">(\s*<!--app-html-->\s*)?<\/div>/,
        `<div id="root">${appHtml}</div>`
      );

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");

  if (!fs.existsSync(distPath)) {
    console.error(`[serveStatic] Error: Build directory not found at ${distPath}`);
    console.error(`[serveStatic] CWD: ${process.cwd()}`);
    try {
      const distRoot = path.resolve(process.cwd(), "dist");
      if (fs.existsSync(distRoot)) {
        console.error(`[serveStatic] Contents of ${distRoot}:`, fs.readdirSync(distRoot));
      } else {
        console.error(`[serveStatic] ${distRoot} does not exist.`);
      }
    } catch (e) { console.error("[serveStatic] Error listing dist:", e); }

    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // SSR for production
  app.use("*", async (req, res, next) => {
    try {
      const template = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");

      // In production, we import the built server entry
      const serverEntryPath = path.resolve(process.cwd(), "dist", "server", "entry-server.js");

      if (!fs.existsSync(serverEntryPath)) {
        // Fallback to client-side rendering if server build is missing, simpler handling
        res.sendFile(path.resolve(distPath, "index.html"));
        return;
      }

      // Dynamic import of the server bundle
      const { render } = await import("file://" + serverEntryPath);

      const { html: appHtml } = await render(req.originalUrl);

      // Robust replacement: handle both unminified (with comment) and minified (empty div) scenarios
      const html = template.replace(
        /<div id="root">(\s*<!--app-html-->\s*)?<\/div>/,
        `<div id="root">${appHtml}</div>`
      );

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      next(e);
    }
  });
}
