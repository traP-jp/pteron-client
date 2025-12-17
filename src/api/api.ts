import { type Url, type UserName, toBranded } from "/@/types/entity";

import Api from "./client";
import type { paths as internalApiPath } from "./schema/internal";
import type { paths as publicApiPath } from "./schema/public";
import type { paths as traqApiPath } from "./schema/traq";

export const api = {
    internal: new Api<internalApiPath>({ baseUrl: toBranded<Url>("/api/internal") }),
    public: new Api<publicApiPath>({ baseUrl: toBranded<Url>("/api/v1") }),
    traq: new Api<traqApiPath>({ baseUrl: toBranded<Url>("https://q.trap.jp/api/v3") }),
};

export const buildTraqIconUrl = (userName: UserName): Url => {
    return toBranded<Url>(`${api.traq.baseUrl}/public/icon/${userName}`);
};

export const buildFallbackIconUrl = (name: string): Url => {
    return toBranded<Url>(`https://api.dicebear.com/9.x/rings/svg?seed=${name}`);
};
