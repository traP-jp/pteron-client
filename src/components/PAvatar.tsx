import { Avatar, type AvatarProps, type MantineSize } from "@mantine/core";

import { buildFallbackIconUrl, buildTraqIconUrl } from "/@/api/api";

import { type UserOrProject, type UserOrProjectType, isUser } from "../types/userOrProject";

export type PAvatarProps<Type extends UserOrProjectType> = AvatarProps & {
    size?: MantineSize | "checkout";
} & UserOrProject<Type>;

export const PAvatar = <Type extends UserOrProjectType>(_props: PAvatarProps<Type>) => {
    const src = isUser(_props) ? buildTraqIconUrl(_props.name) : buildFallbackIconUrl(_props.name);
    const { name, ...props } = _props;

    return (
        <Avatar
            alt={name}
            src={src}
            {...props}
        />
    );
};
