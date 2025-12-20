import { Api as InternalApiClient } from "./schema/internal";
import { Api as PublicApiClient } from "./schema/public";
import { Api as TraqApiClient } from "./schema/traq";

export * from "./paths";

// 環境変数からAPIのbaseURLを取得
// 設定されていれば使用、なければ空文字列（specのデフォルト + ローカルproxy）
// 例: VITE_API_BASE_URL=https://pteron-api.trap.show
const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

const apis = {
    internal: new InternalApiClient({ baseURL: `${baseUrl}/internal` }),
    public: new PublicApiClient({ baseURL: `${baseUrl}/v1` }),
    traq: new TraqApiClient({}),
};

export default apis;
