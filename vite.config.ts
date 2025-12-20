import path from "node:path";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), svgr()],
    resolve: {
        alias: {
            "/@": path.resolve(__dirname, "src"),
        },
    },
    server: {
        open: "/sandbox",
        // MSW無効時 (VITE_USE_MOCK=false) に実APIへ転送
        proxy: {
            "/api/internal": "http://localhost:8080",
            "/api/v1": "http://localhost:8080",
        },
    },
    preview: {
        open: "/",
        // preview時はAPIに接続
        proxy: {
            "/api/internal": {
                target: "https://pteron-api.trap.show",
                changeOrigin: true,
            },
            "/api/v1": {
                target: "https://pteron-api.trap.show",
                changeOrigin: true,
            },
        },
    },
});
