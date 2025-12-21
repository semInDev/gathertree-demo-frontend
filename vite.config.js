import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // 배포 시 지워야함
  server: {
    proxy: {
      "/trees": "https://cdn.beour.store",
    },
  },
});
