import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { PAvatar } from "/@/components/PAvatar";
import { type Copia, toBranded } from "/@/types/entity";
import type { ProjectName, UserName } from "/@/types/entity";

import { CreateProjectModal } from "../components/CreateProjectModal";
import { PAmount } from "../components/PAmount";
import { TrendIndicator } from "../components/TrendIndicator";

const CreateProjectModalSample = () => {
    const [opened, { open, close }] = useDisclosure(false);
    return (
        <>
            <CreateProjectModal
                opened={opened}
                onClose={close}
            />
            <Button
                variant="default"
                onClick={open}
            >
                新規プロジェクトを作成
            </Button>
        </>
    );
};

const Home = () => {
    return (
        <div>
            <h1>Home</h1>
            <TrendIndicator diff={0} />
            <TrendIndicator diff={100} />
            <TrendIndicator diff={-100} />

            <PAvatar
                type="user"
                name={toBranded<UserName>("uni_kakurenbo")}
            />
            <PAvatar
                type="project"
                name={toBranded<ProjectName>("awesome_project")}
            />
            <PAmount
                value={toBranded<Copia>(100000000n)}
                coloring
                size="custom"
                customSize={5}
                leadingIcon
                trailingDash
            />
            <PAmount
                value={toBranded<Copia>(-100000000n)}
                coloring
                size="xl"
                formatOptions={{
                    useGrouping: false,
                }}
            />
            <CreateProjectModalSample />
        </div>
    );
};

export default Home;
