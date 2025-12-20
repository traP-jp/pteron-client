import { Api as InternalApiClient } from "./schema/internal";
import { Api as PublicApiClient } from "./schema/public";
import { Api as TraqApiClient } from "./schema/traq";

export * from "./paths";

const apis = {
    internal: new InternalApiClient({ baseURL: "/api/internal" }),
    public: new PublicApiClient({ baseURL: "/api/v1" }),
    traq: new TraqApiClient({}),
};

export default apis;
