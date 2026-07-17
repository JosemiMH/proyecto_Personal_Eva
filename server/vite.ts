import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";
import { storage } from "./storage";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

type PublicArticle = Awaited<ReturnType<typeof storage.getAllArticles>>[number];

interface InitialQueryData {
  articles?: PublicArticle[];
  article?: PublicArticle;
  articleSlug?: string;
  relatedArticles?: PublicArticle[];
}

interface SsrPage {
  status: number;
  initialData: InitialQueryData;
}

interface SsrRenderResult {
  html: string;
  helmetContext: Record<string, unknown>;
}

interface SsrRenderer {
  render(url: string, initialData?: InitialQueryData): Promise<SsrRenderResult>;
}

const clientRoutes = new Set([
  "/",
  "/privacy",
  "/terms",
  "/cookies",
  "/booking",
  "/resources",
  "/auditoria-spa-hoteles",
  "/auth",
  "/admin",
]);

let articleCache: { expiresAt: number; articles: PublicArticle[] } | undefined;

function normalizePathname(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

function getRequestPath(req: express.Request) {
  return new URL(req.originalUrl, "http://localhost").pathname;
}

async function getCachedArticles() {
  const now = Date.now();
  if (articleCache && articleCache.expiresAt > now) {
    return articleCache.articles;
  }

  const articles = await storage.getAllArticles();
  articleCache = {
    articles,
    expiresAt: now + 60_000,
  };
  return articles;
}

async function resolveSsrPage(pathname: string): Promise<SsrPage> {
  const normalizedPath = normalizePathname(pathname);

  if (normalizedPath === "/") {
    try {
      return {
        status: 200,
        initialData: { articles: await getCachedArticles() },
      };
    } catch (error) {
      console.error("Unable to preload articles for SSR:", error);
      return { status: 200, initialData: { articles: [] } };
    }
  }

  if (normalizedPath.startsWith("/blog/")) {
    const slug = normalizedPath.slice("/blog/".length);
    if (!slug || slug.includes("/")) {
      return { status: 404, initialData: {} };
    }

    const articles = await getCachedArticles();
    const article = articles.find((item) => item.slug === slug);
    if (!article) {
      return { status: 404, initialData: {} };
    }

    return {
      status: 200,
      initialData: {
        article,
        articleSlug: slug,
        relatedArticles: articles
          .filter((item) => item.slug !== slug && item.language === article.language)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3),
      },
    };
  }

  if (clientRoutes.has(normalizedPath)) {
    return { status: 200, initialData: {} };
  }

  return { status: 404, initialData: {} };
}

function serializeForInlineScript(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function applyHelmet(template: string, helmetContext: Record<string, unknown>) {
  const helmet = (helmetContext as any)?.helmet;
  if (!helmet) return template;

  const title = helmet.title?.toString?.() || "";
  const meta = helmet.meta?.toString?.() || "";
  const link = helmet.link?.toString?.() || "";
  const script = helmet.script?.toString?.() || "";
  const style = helmet.style?.toString?.() || "";
  const noscript = helmet.noscript?.toString?.() || "";
  const headMarkup = [title, meta, link, script, style, noscript].filter(Boolean).join("\n");

  let html = template;
  if (title || meta || link) {
    html = html
      .replace(/<title\b[^>]*\bdata-rh="true"[^>]*>[\s\S]*?<\/title>\s*/gi, "")
      .replace(/<meta\b[^>]*\bdata-rh="true"[^>]*\/?>(?:\s*)/gi, "")
      .replace(/<link\b[^>]*\bdata-rh="true"[^>]*\/?>(?:\s*)/gi, "");
  }

  const htmlAttributes = helmet.htmlAttributes?.toString?.() || "";
  if (htmlAttributes) {
    html = html.replace(/<html\b[^>]*>/i, `<html ${htmlAttributes}>`);
  }

  if (headMarkup) {
    html = html.replace("</head>", `${headMarkup}\n</head>`);
  }

  return html;
}

function renderDocument(
  template: string,
  appHtml: string,
  helmetContext: Record<string, unknown>,
  initialData: InitialQueryData,
) {
  let html = template.replace(
    /<div id="root">([\s\S]*?)<\/div>/,
    `<div id="root">${appHtml}</div>`,
  );

  html = applyHelmet(html, helmetContext);

  if (Object.keys(initialData).length > 0) {
    const initialDataScript = `<script id="__INITIAL_QUERY_DATA__">window.__INITIAL_QUERY_DATA__=${serializeForInlineScript(initialData)};</script>`;
    html = html.replace("</head>", `${initialDataScript}\n</head>`);
  }

  return html;
}

export async function setupVite(app: Express, server: Server) {
  const { createServer: createViteServer, createLogger } = await import("vite");

  const viteLogger = createLogger();
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: { server },
    },
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
    try {
      const clientTemplate = path.resolve(__dirname, "..", "client", "index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = await vite.transformIndexHtml(req.originalUrl, template);

      const requestPath = getRequestPath(req);
      const page = await resolveSsrPage(requestPath);
      const renderer = await vite.ssrLoadModule("/src/entry-server.tsx") as SsrRenderer;
      const rendered = await renderer.render(requestPath, page.initialData);
      const html = renderDocument(template, rendered.html, rendered.helmetContext, page.initialData);

      res.status(page.status).set({ "Content-Type": "text/html" }).end(html);
    } catch (error: any) {
      vite.ssrFixStacktrace(error);
      next(error);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");
  const prerenderPath = path.resolve(process.cwd(), "dist", "prerender");
  const manifestPath = path.resolve(prerenderPath, "manifest.json");

  if (!fs.existsSync(distPath) || !fs.existsSync(manifestPath)) {
    throw new Error("Production build is missing public or prerendered files");
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
    routes: Record<string, string>;
    blogs: Record<string, string>;
    notFound: string;
  };
  const sendPrerendered = (
    res: express.Response,
    next: express.NextFunction,
    filename: string,
    status = 200,
  ) => {
    const absolutePath = path.resolve(prerenderPath, filename);
    if (!absolutePath.startsWith(`${prerenderPath}${path.sep}`)) {
      return next(new Error("Invalid prerendered file path"));
    }
    res.status(status).sendFile(absolutePath, (error) => {
      if (error) next(error);
    });
  };

  app.use(express.static(distPath, { index: false }));

  for (const [route, filename] of Object.entries(manifest.routes)) {
    app.get(route, (_req, res, next) => sendPrerendered(res, next, filename));
  }

  app.get("/blog/:slug", (req, res, next) => {
    const filename = manifest.blogs[req.params.slug];
    if (filename) {
      return sendPrerendered(res, next, filename);
    }
    return sendPrerendered(res, next, manifest.notFound, 404);
  });

  app.get(["/auth", "/admin"], (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });

  app.use("*", (_req, res, next) => {
    sendPrerendered(res, next, manifest.notFound, 404);
  });
}
