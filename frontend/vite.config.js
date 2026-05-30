import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom") ||
              id.includes("framer-motion")
            ) {
              return "vendor";
            }
          }
        },
      },
    },
  },
  server: {
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost:5500",
        changeOrigin: true,
      },
    },
  },
});
