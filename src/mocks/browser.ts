/**
 * ブラウザ環境用 MSW Service Worker 設定
 */
import { setupWorker } from "msw/browser";

import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
