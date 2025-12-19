import { useEffect, useState } from "react";

import { Avatar, type AvatarProps, type MantineSize } from "@mantine/core";

import { buildFallbackIconUrl, buildTraqIconUrl } from "/@/api";
import { type Url, toBranded } from "/@/types/entity";

import { type UserOrProject, type UserOrProjectType, isUser } from "../types/userOrProject";

export type PAvatarProps<Type extends UserOrProjectType> = AvatarProps & {
    size?: MantineSize | "checkout";
} & UserOrProject<Type>;

export const PAvatar = <Type extends UserOrProjectType>(_props: PAvatarProps<Type>) => {
    const { name, ...props } = _props;
    const [src, setSrc] = useState<Url>(toBranded<Url>(""));

    useEffect(() => {
        const buildUrl = async () =>
            isUser(_props) ? buildTraqIconUrl(_props.name) : buildFallbackIconUrl(_props.name);

        buildUrl().then(url => setSrc(url));
    });

    return (
        <Avatar
            alt={name}
            src={src}
            {...props}
        />
    );
};
