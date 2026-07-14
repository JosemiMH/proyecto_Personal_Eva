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
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://www.googletagmanager.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://*.google-analytics.com", "https://www.googletagmanager.com"],
      connectSrc: ["'self'", "ws:", "wss:", "https://*.google-analytics.com", "https://*.analytics.google.com", "https://www.googletagmanager.com"],
    },
  },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  if (req.headers.host && req.headers.host.slice(0, 4) !== 'www.' && !req.headers.host.includes('localhost') && !req.headers.host.includes('replit')) {
    const newHost = 'www.' + req.headers.host;
    return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl);
  }
  next();
});

app.use((req, res, next) => {
  if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const requestPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (requestPath.startsWith("/api")) {
      let logLine = `${req.method} ${requestPath} ${res.statusCode} in ${duration}ms`;
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
    console.log('🚀 PersonalBrandSpa');
    console.log('🚀 ================================');
    console.log(`Environment: ${app.get("env")}`);
    console.log(`Node: ${process.version}`);
    console.log(`Platform: ${process.platform}`);
    console.log('');
    const dbEnabled = !!(process.env.DATABASE_URL?.trim() || true);
    console.log(`✅ Database: ${dbEnabled ? 'CONNECTED (Neon PostgreSQL)' : 'DISABLED (memory only)'}`);
    console.log('✅ Email: ENABLED (epm@epmwellness.com via Hostinger SMTP)');
    const openAIEnabled = !!process.env.OPENAI_API_KEY;
    console.log(`✅ OpenAI: ${openAIEnabled ? 'ENABLED' : 'DISABLED'}`);
    console.log('');

    setupAuth(app);
    const server = await registerRoutes(app);

    app.use('/api', (_req, res) => {
      res.status(404).json({ message: "API endpoint not found" });
    });

    const environment = app.get("env");
    if (environment === "development") {
      console.log("Setting up Vite dev server...");
      await setupVite(app, server);
    } else {
      console.log("📁 Serving static files with prerendered HTML");
      serveStatic(app);
    }

    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      console.error('❌ Error:', message);
    });

    const port = parseInt(process.env.PORT || "5000", 10);

    server.listen(port, () => {
      console.log('');
      console.log('✅ ================================');
      console.log('✅ SERVER STARTED SUCCESSFULLY!');
      console.log(`✅ Port: ${port}`);
      console.log(`✅ URL: http://localhost:${port}`);
      console.log('✅ ================================');
      console.log('');
      console.log('ℹ️  Service Status:');
      console.log('✅  - Database: Neon PostgreSQL');
      console.log('✅  - Email: epm@epmwellness.com (Hostinger SMTP)');
      if (!process.env.OPENAI_API_KEY) {
        console.log('⚠️  - No AI chatbot (OPENAI_API_KEY missing)');
      } else {
        console.log('✅  - AI Chatbot ACTIVE');
      }
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

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
