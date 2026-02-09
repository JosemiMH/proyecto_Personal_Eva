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
    // Import database test utility
    const { testDatabaseConnection, validateDatabaseUrl } = await import('./test-db-connection');

    // Validate DATABASE_URL first
    if (!validateDatabaseUrl()) {
      console.error('Please set DATABASE_URL in your environment variables');
      console.error('Example: postgresql://user:pass@host:port/dbname?sslmode=require');
      // Continue anyway - will use memory store for sessions
    }

    // Test database connection (non-blocking)
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      console.warn('⚠ Starting server without database connection');
      console.warn('⚠ Some features may not work correctly');
    }

    setupAuth(app);
    const server = await registerRoutes(app);

    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error('Error handler:', err);
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    const environment = app.get("env");
    console.log(`Environment: ${environment}`);
    console.log(`Node version: ${process.version}`);
    console.log(`Platform: ${process.platform}`);

    if (environment === "development") {
      console.log("Setting up Vite dev server...");
      await setupVite(app, server);
      console.log("Vite dev server setup complete.");
    } else {
      console.log("Serving static files from dist/public");
      serveStatic(app);
    }

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || "5000", 10);
    server.listen({
      port,
      host: "0.0.0.0",

    }, () => {
      log(`serving on port ${port}`);
      log(`Visit: http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Fatal error during startup:', error);
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
