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

export default apis;