import type { ProjectName, UserName } from "./entity";

export type UserOrProjectType = "user" | "project";

export interface UserOrProject<Type extends UserOrProjectType = UserOrProjectType> {
    type: Type;
    name: Type extends "user" ? UserName : ProjectName;
}

export const isUser = (props: UserOrProject): props is UserOrProject<"user"> => {
    return props.type === "user";
};

export const isProject = (props: UserOrProject): props is UserOrProject<"project"> => {
    return props.type === "project";
};
