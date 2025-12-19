import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";

async function enableMocking() {
    if (import.meta.env.DEV) {
        const { worker } = await import("./mocks/browser");
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
