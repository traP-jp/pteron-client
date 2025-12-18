import { Avatar, type AvatarProps, type MantineSize } from "@mantine/core";

import { buildFallbackIconUrl, buildTraqIconUrl } from "/@/api/api";
import { type ProjectName, type UserName, toBranded } from "/@/types/entity";

type AvatarType = "user" | "project";

export type PAvatarProps<Type extends AvatarType> = AvatarProps & {
    size?: MantineSize | "checkout";
    type: Type;
    name: Type extends "user" ? UserName : ProjectName;
};

export const PAvatar = <Type extends AvatarType>({ type, name, ...props }: PAvatarProps<Type>) => {
    const src =
        type === "user" ? buildTraqIconUrl(toBranded<UserName>(name)) : buildFallbackIconUrl(name);

    return (
        <Avatar
            alt={name}
            src={src}
            {...props}
        />
    );
};
