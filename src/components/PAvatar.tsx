import { Suspense, use } from "react";

import { Avatar, type AvatarProps, type MantineSize } from "@mantine/core";

import { buildFallbackIconUrl, buildTraqIconUrl } from "/@/api";
import { type Entity, type EntityType, isUser } from "/@/types/composed";
import type { Url } from "/@/types/entity";

export type PAvatarProps<Type extends EntityType> = AvatarProps & {
    size?: MantineSize | "checkout";
} & Entity<Type>;

const getUrl = async (entity: Entity) =>
    isUser(entity) ? buildTraqIconUrl(entity.name) : buildFallbackIconUrl(entity.name);

const ThePAvatar = ({
    urlGetter,
    ...props
}: AvatarProps & {
    urlGetter: Promise<Url>;
}) => {
    return (
        <Avatar
            src={use(urlGetter)}
            {...props}
        />
    );
};

export const PAvatar = <Type extends EntityType>({ type, name, ...props }: PAvatarProps<Type>) => {
    return (
        <Suspense
            fallback={
                <Avatar
                    alt={name}
                    {...props}
                />
            }
        >
            <ThePAvatar
                alt={name}
                urlGetter={getUrl({ type, name })}
                {...props}
            />
        </Suspense>
    );
};
