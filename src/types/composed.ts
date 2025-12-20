import type { ProjectName, UserName } from "./entity";

export type EntityType = "user" | "project";

export interface Entity<Type extends EntityType = EntityType> {
    type: Type;
    name: Type extends "user" ? UserName : ProjectName;
}

export const isUser = (props: Entity): props is Entity<"user"> => {
    return props.type === "user";
};

export const isProject = (props: Entity): props is Entity<"project"> => {
    return props.type === "project";
};
