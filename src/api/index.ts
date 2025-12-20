import { makeInterceptorInjector } from "./client";
import { authErrorHandler, axiosErrorHandler } from "./errors";
import { type ApiConfig, Api as InternalApiClient } from "./schema/internal";
import { Api as PublicApiClient } from "./schema/public";
import { Api as TraqApiClient } from "./schema/traq";

const config: ApiConfig = {};

const injectGeneralErrorHandler = makeInterceptorInjector({
    response: [response => response, axiosErrorHandler],
});

const injectAuthErrorHandler = makeInterceptorInjector({
    response: [response => response, authErrorHandler],
});

const apis = {
    internal: injectGeneralErrorHandler(injectAuthErrorHandler(new InternalApiClient(config))),
    public: injectGeneralErrorHandler(new PublicApiClient(config)),
    traq: injectGeneralErrorHandler(new TraqApiClient(config)),
};

export default apis;
