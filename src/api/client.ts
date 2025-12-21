import axios from "axios";
import type { AxiosInstance } from "axios";

import type { Invocable } from "../types/entity";

export const apiClient = axios.create({
    baseURL: "",
    headers: {
        "Content-Type": "application/json",
    },
});

export const makeInterceptorInjector =
    ({ request, response }: { request?: Invocable[]; response?: Invocable[] }) =>
    <Client extends { instance: AxiosInstance }>(client: Client): Client => {
        if (request) client.instance.interceptors.request.use(...request);
        if (response) client.instance.interceptors.response.use(...response);
        return client;
    };
