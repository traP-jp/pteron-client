import path from "node:path";

import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    // プロキシ用のヘッダー設定
    const proxyHeaders: Record<string, string> = {};

    // DEV_USER: X-Forwarded-User ヘッダーを付与（ローカルサーバーのDEBUG_MODE時に使用）
    if (env.DEV_USER) {
        proxyHeaders["X-Forwarded-User"] = env.DEV_USER;
    }

    // FORWARD_AUTH_COOKIE: 本番API接続時のTraefik認証用クッキーを転送
    if (env.FORWARD_AUTH_COOKIE) {
        proxyHeaders["Cookie"] = `_forward_auth=${env.FORWARD_AUTH_COOKIE}`;
    }

    return {
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
                "/api/internal": {
                    target: "http://localhost:8080",
                    headers: proxyHeaders,
                },
                "/api/v1": {
                    target: "http://localhost:8080",
                    headers: proxyHeaders,
                },
            },
        },
        preview: {
            open: "/",
            // preview時は本番APIに接続
            proxy: {
                "/api/internal": {
                    target: "https://pteron.trap.show",
                    changeOrigin: true,
                    headers: proxyHeaders,
                },
                "/api/v1": {
                    target: "https://pteron.trap.show",
                    changeOrigin: true,
                    headers: proxyHeaders,
                },
            },
        },
    };
});
