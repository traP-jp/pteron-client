import apis from ".";
import type { InternalAxiosRequestConfig } from "axios";

import { type Url, type UserName, toBranded } from "/@/types/entity";

export const dummyAdapter = async (config: InternalAxiosRequestConfig) => ({
    data: {},
    status: 0,
    statusText: "",
    headers: {},
    config,
});

export const buildTraqIconUrl = async (userName: UserName): Promise<Url> => {
    const {
        config: { baseURL, url },
    } = await apis.traq.public.getPublicUserIcon(userName, {
        adapter: dummyAdapter,
    });

    return toBranded<Url>(`${baseURL}${url}`);
};

export const buildFallbackIconUrl = (name: string): Url => {
    return toBranded<Url>(`https://api.dicebear.com/9.x/rings/svg?seed=${name}`);
};
