import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: isSsrBuild ? {
      // Hostinger's runtime cannot reliably load Vite's lazy SSR chunks.
      // Keep the server renderer in one deployable module.
      output: { inlineDynamicImports: true },
    } : undefined,
  },
  optimizeDeps: {
    exclude: ['esbuild'] // Force Vite to not try to optimize esbuild itself
  },
  ssr: {
    // Package ships as CommonJS at runtime. Bundling it keeps named exports
    // consistent between the browser build and Node SSR.
    noExternal: ["react-helmet-async"],
  },
}));
