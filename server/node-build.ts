import path from "path";
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { fileURLToPath } from "url";
import { createServer } from "./index";
import * as express from "express";

const app = createServer();
const port = process.env.PORT || 3000;
const httpsPort = process.env.HTTPS_PORT || 5443;
const enableHttps = process.env.ENABLE_HTTPS === "true";
const sslKeyPath = process.env.SSL_KEY_PATH;
const sslCertPath = process.env.SSL_CERT_PATH;

// In production, serve the built SPA files
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "../dist/spa");

// Serve static files
app.use(express.static(distPath));

// Handle React Router - serve index.html for all non-API routes
app.use((req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  const indexPath = path.join(distPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("Error serving index.html:", err);
      res.status(404).json({ error: "index.html not found", path: indexPath });
    }
  });
});

// Start HTTPS server if enabled
if (enableHttps && sslKeyPath && sslCertPath) {
  try {
    const key = fs.readFileSync(sslKeyPath, "utf8");
    const cert = fs.readFileSync(sslCertPath, "utf8");
    const httpsServer = https.createServer({ key, cert }, app);

    httpsServer.listen(httpsPort, () => {
      console.log(
        `🚀 Fusion Starter HTTPS server running on port ${httpsPort}`,
      );
      console.log(`📱 Frontend: https://localhost:${httpsPort}`);
      console.log(`🔧 API: https://localhost:${httpsPort}/api`);
      console.log(`🔐 SSL: Enabled`);
    });

    // Also start HTTP server that redirects to HTTPS
    const httpServer = http.createServer((req, res) => {
      res.writeHead(301, {
        Location: `https://${req.headers.host}${req.url}`,
      });
      res.end();
    });

    httpServer.listen(port, () => {
      console.log(
        `🔄 HTTP redirect server running on port ${port} -> HTTPS on ${httpsPort}`,
      );
    });

    // Graceful shutdown for both servers
    const shutdown = () => {
      console.log("🛑 Shutting down gracefully");
      httpsServer.close(() => {
        console.log("✓ HTTPS server closed");
      });
      httpServer.close(() => {
        console.log("✓ HTTP redirect server closed");
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error("✗ Forced shutdown");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error("❌ Failed to load SSL certificates:", error);
    console.error("Make sure SSL_KEY_PATH and SSL_CERT_PATH are set correctly");
    process.exit(1);
  }
} else {
  // Start HTTP server only
  app.listen(port, () => {
    console.log(`🚀 Fusion Starter server running on port ${port}`);
    console.log(`📱 Frontend: http://localhost:${port}`);
    console.log(`🔧 API: http://localhost:${port}/api`);
    if (!enableHttps) {
      console.log("🔓 HTTPS: Disabled (ENABLE_HTTPS=false)");
    }
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("🛑 Received SIGTERM, shutting down gracefully");
    process.exit(0);
  });

  process.on("SIGINT", () => {
    console.log("🛑 Received SIGINT, shutting down gracefully");
    process.exit(0);
  });
}
