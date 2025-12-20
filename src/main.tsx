import React from "react";
import ReactDOM from "react-dom/client";

import App from "/@/App.tsx";

async function enableMocking() {
    // VITE_USE_MOCK が "false" の場合はMSWを無効化
    // 未設定 または "true" の場合は開発環境でMSWを有効化
    const useMock = import.meta.env.VITE_USE_MOCK !== "false";

    if (import.meta.env.DEV && useMock) {
        const { worker } = await import("/@/api/mocks/browser");
        return worker.start({
            onUnhandledRequest: "bypass",
        });
    }
    return Promise.resolve();
}

enableMocking().then(() => {
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
});
