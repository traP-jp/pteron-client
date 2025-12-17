import type { Client, ClientOptions } from "openapi-fetch";
import createClient from "openapi-fetch";
import type { MediaType } from "openapi-typescript-helpers";

import type { Url } from "/@/types/entity";

type Options = Omit<ClientOptions, "baseUrl"> & { baseUrl: Url };

export default class Api<Paths extends object, Media extends MediaType = MediaType> {
    public readonly client: Client<Paths, Media>;
    public readonly baseUrl: Url;

    constructor(options: Options) {
        const { baseUrl } = options;

        this.client = createClient<Paths, Media>(options);
        this.baseUrl = baseUrl;
    }
}
