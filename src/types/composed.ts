import type { SystemName } from "/@/config/constants";
import type { ProjectName, UserName } from "/@/types/entity";

export type EntityType = "user" | "project" | "system";

export interface Entity<Type extends EntityType = EntityType> {
    type: Type;
    name: Type extends "user" ? UserName : Type extends "project" ? ProjectName : SystemName;
}

export const isUser = (props: Entity): props is Entity<"user"> => {
    return props.type === "user";
};

export const isProject = (props: Entity): props is Entity<"project"> => {
    return props.type === "project";
};

export const isAdmin = (props: Entity): props is Entity<"system"> => {
    return props.type === "system";
};
