import { Suspense, use, useMemo } from "react";

import { Avatar, type AvatarProps, type MantineSize, useMantineColorScheme } from "@mantine/core";

import { buildFallbackIconUrl, buildTraqIconUrl } from "/@/api/paths";
import copiaIcon from "/@/assets/icons/copia.svg";
import whiteIcon from "/@/assets/icons/white_icon.svg";
import { type Entity, type EntityType, isProject, isUser } from "/@/types/composed";
import { type Url, toBranded } from "/@/types/entity";

export type PAvatarProps<Type extends EntityType> = AvatarProps & {
    size?: MantineSize | "checkout";
} & Entity<Type>;

const getUrl = async (entity: Entity, colorScheme: "light" | "dark" | "auto") =>
    isUser(entity)
        ? buildTraqIconUrl(entity.name)
        : isProject(entity)
          ? buildFallbackIconUrl(entity.name)
          : toBranded<Url>(colorScheme === "dark" ? whiteIcon : copiaIcon);

// URLキャッシュを保持するMap
const urlCache = new Map<string, Promise<Url>>();

const getCachedUrl = (entity: Entity, colorScheme: "light" | "dark" | "auto"): Promise<Url> => {
    const key = `${entity.type}:${entity.name}:${colorScheme}`;
    if (!urlCache.has(key)) {
        urlCache.set(key, getUrl(entity, colorScheme));
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
    const { colorScheme } = useMantineColorScheme();
    const urlGetter = useMemo(
        () => getCachedUrl({ type, name }, colorScheme),
        [type, name, colorScheme]
    );

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
