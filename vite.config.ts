import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Fusion PDF — Vite configuration.
// Keep this minimal. The pdf.js worker is resolved at runtime via
// `new URL(..., import.meta.url)` in src/utils/pdfWorker.ts, so no
// special worker plugin config is required here.
export default defineConfig({
  plugins: [react()],
  worker: {
    format: "es",
  },
  build: {
    target: "es2020",
  },
});
