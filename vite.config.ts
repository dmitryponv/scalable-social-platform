import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "./server";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development" || !process.env.VITE_PRODUCTION;

  return {
    root: __dirname,
    server: {
      host: "::",
      port: 8080,
      fs: {
        allow: [".", "./client", "./shared"],
        deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
      },
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      target: "esnext",
      minify: "esbuild",
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    plugins: [
      react(),
      isDev ? expressPlugin() : null,
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client"),
        "@shared": path.resolve(__dirname, "shared"),
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom"],
    },
  };
});

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
