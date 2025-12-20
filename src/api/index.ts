import { type ApiConfig, Api as InternalApiClient } from "./schema/internal";
import { Api as PublicApiClient } from "./schema/public";
import { Api as TraqApiClient } from "./schema/traq";

export * from "./paths";

const config: ApiConfig = {};

const apis = {
    internal: new InternalApiClient(config),
    public: new PublicApiClient(config),
    traq: new TraqApiClient(config),
};

// 認証エラー時のグローバルハンドリング
// 本番サーバーは認証なしの場合 401 ではなく 404 を返すことがある
apis.internal.instance.interceptors.response.use(
    response => response,
    error => {
        const status = error.response?.status;
        if (status === 401 || status === 404) {
            console.warn(`[API] 認証エラー (${status}): ログインが必要です。`);
            // 空のレスポンスを返してUIがクラッシュしないようにする
            return Promise.resolve({ data: { items: [] }, status });
        }
        return Promise.reject(error);
    }
);

export default apis;
