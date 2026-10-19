import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  // Base must be the repository path so built assets resolve correctly on GitHub Pages
  // For user pages at https://<user>.github.io/<repo>/ set base to `/<repo>/`
  base: "/phs-clms/",
  plugins: [react(), tailwindcss()],
  resolve: {
    // Ensure only a single copy of React is used by the bundle to avoid "Invalid Hook Call" caused by duplicate React copies
    dedupe: ["react", "react-dom"],
    alias: {
      // Force Vite to resolve react/react-dom to the project node_modules
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
  },
});
