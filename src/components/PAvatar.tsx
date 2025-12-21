import { Suspense, use, useMemo } from "react";

import { Avatar, type AvatarProps, type MantineSize } from "@mantine/core";

import { buildFallbackIconUrl, buildTraqIconUrl } from "/@/api/paths";
import copiaIcon from "/@/assets/icons/copia.svg";
import { type Entity, type EntityType, isProject, isUser } from "/@/types/composed";
import { type Url, toBranded } from "/@/types/entity";

export type PAvatarProps<Type extends EntityType> = AvatarProps & {
    size?: MantineSize | "checkout";
} & Entity<Type>;

const getUrl = async (entity: Entity) =>
    isUser(entity)
        ? buildTraqIconUrl(entity.name)
        : isProject(entity)
          ? buildFallbackIconUrl(entity.name)
          : toBranded<Url>(copiaIcon);

// URLキャッシュを保持するMap
const urlCache = new Map<string, Promise<Url>>();

const getCachedUrl = (entity: Entity): Promise<Url> => {
    const key = `${entity.type}:${entity.name}`;
    if (!urlCache.has(key)) {
        urlCache.set(key, getUrl(entity));
    }
    return urlCache.get(key)!;
};

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
    const urlGetter = useMemo(() => getCachedUrl({ type, name }), [type, name]);

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
                urlGetter={urlGetter}
                {...props}
            />
        </Suspense>
    );
};
