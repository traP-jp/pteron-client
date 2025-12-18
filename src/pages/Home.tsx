import { PAvater } from "/@/components/PAvatar";
import { toBranded } from "/@/types/entity";
import type { ProjectName, UserName } from "/@/types/entity";

import { TrendIndicator } from "../components/TrendIndicator";

export const Home = () => {
    return (
        <div>
            {TrendIndicator(0)}
            {TrendIndicator(1)}
            {TrendIndicator(-100)}
            <h1>Home</h1>

            <PAvater
                type="user"
                name={toBranded<UserName>("uni_kakurenbo")}
            />
            <PAvater
                type="project"
                name={toBranded<ProjectName>("awesome_project")}
            />
        </div>
    );
};
