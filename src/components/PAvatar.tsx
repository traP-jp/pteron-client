import { Suspense, useEffect, useState } from "react";

import { Avatar, type AvatarProps, type MantineSize } from "@mantine/core";

import { buildFallbackIconUrl, buildTraqIconUrl } from "/@/api";
import { type ProjectName, type Url, type UserName, toBranded } from "/@/types/entity";

type AvatarType = "user" | "project";

export type PAvatarProps<Type extends AvatarType> = AvatarProps & {
    size?: MantineSize | "checkout";
    type: Type;
    name: Type extends "user" ? UserName : ProjectName;
};

export const PAvatar = <Type extends AvatarType>({ type, name, ...props }: PAvatarProps<Type>) => {
    const [src, setSrc] = useState<Url>(toBranded<Url>(""));

    useEffect(() => {
        const buildUrl = async () =>
            type === "user"
                ? buildTraqIconUrl(toBranded<UserName>(name))
                : buildFallbackIconUrl(name);

        buildUrl().then(url => setSrc(url));
    });

    return (
        <Suspense>
            {
                <Avatar
                    alt={name}
                    src={src}
                    {...props}
                />
            }
        </Suspense>
    );
};
