import { Api as InternalApiClient } from "./schema/internal";
import { Api as PublicApiClient } from "./schema/public";
import { Api as TraqApiClient } from "./schema/traq";

export * from "./paths";

// 環境変数からAPIのbaseURLを取得
// 設定されていれば使用、なければspecのデフォルト値を使用
// 例: VITE_API_BASE_URL=https://pteron-api.trap.show
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// 環境変数があれば上書き、なければ空オブジェクト（specのデフォルト値を使用）
const internalConfig = apiBaseUrl ? { baseURL: `${apiBaseUrl}/internal` } : {};
const publicConfig = apiBaseUrl ? { baseURL: `${apiBaseUrl}/v1` } : {};

const apis = {
    internal: new InternalApiClient(internalConfig),
    public: new PublicApiClient(publicConfig),
    traq: new TraqApiClient({}),
};

export default apis;
