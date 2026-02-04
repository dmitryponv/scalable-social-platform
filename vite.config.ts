import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "./server";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.resolve(__dirname, "client");
const sharedDir = path.resolve(__dirname, "shared");

// Custom Rollup plugin to resolve @ and @shared aliases
function aliasPlugin(): Plugin {
  return {
    name: "alias-resolver",
    resolveId(id) {
      if (id.startsWith("@/")) {
        return path.resolve(clientDir, id.slice(2));
      }
      if (id.startsWith("@shared/")) {
        return path.resolve(sharedDir, id.slice(8));
      }
      return null;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: __dirname,
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
    sourcemap: false,
    target: "esnext",
    minify: "esbuild",
  },
  plugins: [aliasPlugin(), react(), expressPlugin()],
  resolve: {
    alias: [
      { find: "@", replacement: clientDir },
      { find: "@shared", replacement: sharedDir },
    ],
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
}));

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
