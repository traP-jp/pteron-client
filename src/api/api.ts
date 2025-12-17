import createClient from "openapi-fetch";

import type { paths as internalApiPath } from "./schema/internal";
import type { paths as publicApiPath } from "./schema/public";

export const api = {
    internal: createClient<internalApiPath>({ baseUrl: "/api/internal" }),
    public: createClient<publicApiPath>({ baseUrl: "/api/v1" }),
};
