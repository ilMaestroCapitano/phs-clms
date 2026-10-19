import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  // Base must be the repository path so built assets resolve correctly on GitHub Pages
  // For user pages at https://<user>.github.io/<repo>/ set base to `/<repo>/`
  base: "/phs-clms/",
  plugins: [react(), tailwindcss()],
});
