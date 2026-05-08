import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/admin": "http://localhost:5174",
      "/billing": "http://localhost:5175",
      "/dashboard": "http://localhost:5176"
    }
  }
});
