import 'dotenv/config';
import express from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupAuth } from "./auth";

import helmet from "helmet";

const app = express();
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://replit.com", "https://*.replit.com", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://*.replit.com"],
      connectSrc: ["'self'", "ws:", "wss:", "https://*.replit.com"],
    },
  },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    console.log('');
    console.log('🚀 ================================');
    console.log('🚀 PersonalBrandSpa MINIMAL VERSION');
    console.log('🚀 ================================');
    console.log(`Environment: ${app.get("env")}`);
    console.log(`Node: ${process.version}`);
    console.log(`Platform: ${process.platform}`);
    console.log('');
    console.log('✅ Database: DISABLED (memory only)');
    console.log('✅ Email: DISABLED (console only)');
    console.log('✅ OpenAI: DISABLED');
    console.log('');

    // Setup auth and routes (simplified)
    setupAuth(app);
    const server = await registerRoutes(app);

    // Error handler
    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      console.error('❌ Error:', message);
    });

    // Setup Vite (dev) or static serving (production)
    const environment = app.get("env");
    if (environment === "development") {
      console.log("Setting up Vite dev server...");
      await setupVite(app, server);
    } else {
      console.log("📁 Serving static files from dist/public");
      serveStatic(app);
    }

    // Start listening
    const port = parseInt(process.env.PORT || "5000", 10);

    server.listen(port, "0.0.0.0", () => {
      console.log('');
      console.log('✅ ================================');
      console.log(`✅ SERVER STARTED SUCCESSFULLY!`);
      console.log(`✅ Port: ${port}`);
      console.log(`✅ URL: http://localhost:${port}`);
      console.log('✅ ================================');
      console.log('');
      console.log('⚠️  REMEMBER: This is a minimal version');
      console.log('⚠️  - No database (data in memory only)');
      console.log('⚠️  - No emails sent (logged to console)');
      console.log('⚠️  - No AI chatbot');
      console.log('');
    });

  } catch (error) {
    console.error('');
    console.error('❌ ================================');
    console.error('❌ FATAL STARTUP ERROR');
    console.error('❌ ================================');
    console.error(error);
    console.error('');
    process.exit(1);
  }
})();

// Global error handler for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Keep process alive if possible, or exit cleanly?
  // Usually exit(1) is better for restart policies, but let's log extensively.
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
