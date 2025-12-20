import { Suspense, use, useState } from "react";

import { Button, Flex, Select, SimpleGrid, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

import apis from "/@/api";
import type { Project } from "/@/api/schema/internal";
import { CreateProjectModal } from "/@/components/CreateProjectModal";
import { EntityCard } from "/@/components/EntityCard";
import { type Copia, type ProjectName, type Url, toBranded } from "/@/types/entity";

type SortOption = "balance-desc" | "balance-asc" | "name-asc" | "name-desc";

const CreateNewProject = ({ onProjectCreated }: { onProjectCreated: () => void }) => {
    const [opened, { open, close }] = useDisclosure(false);

    const handleSuccess = () => {
        close();
        onProjectCreated();
    };

    return (
        <>
            <CreateProjectModal
                opened={opened}
                onClose={handleSuccess}
            />
            <Button
                color="green"
                className="flex"
                onClick={open}
                size="compact-md"
            >
                <IconPlus />
                <Text
                    fw={600}
                    size="sm"
                    mx="xs"
                >
                    プロジェクトを作成
                </Text>
            </Button>
        </>
    );
};

const sortProjects = (projects: Project[], sortBy: SortOption) => {
    return [...projects].sort((a, b) => {
        switch (sortBy) {
            case "balance-desc":
                return b.balance - a.balance;
            case "balance-asc":
                return a.balance - b.balance;
            case "name-asc":
                return a.name.localeCompare(b.name);
            case "name-desc":
                return b.name.localeCompare(a.name);
                return 0;
        }
    });
};

export const AllProjects = ({ sortBy, fetcher }: { sortBy: SortOption; fetcher: Fetcher }) => {
    const { projects } = use(fetcher);
    const sortedProjects = sortProjects(projects, sortBy);

    return (
        <SimpleGrid
            cols={{ base: 1, md: 2, xl: 3 }}
            spacing="md"
        >
            {sortedProjects.map(project => {
                return (
                    <EntityCard
                        key={project.id}
                        type="project"
                        name={toBranded<ProjectName>(project.name)}
                        amount={toBranded<Copia>(BigInt(project.balance))}
                        withBorder
                        p="xl"
                        radius="md"
                        extraLink={toBranded<Url>(project.url ?? "")}
                    />
                );
            })}
        </SimpleGrid>
    );
};

export const OwnProjects = ({ sortBy, fetcher }: { sortBy: SortOption; fetcher: Fetcher }) => {
    const { ownProjects } = use(fetcher);

    return (
        <SimpleGrid
            cols={{ base: 1, md: 2, xl: 3 }}
            spacing="md"
        >
            {sortProjects(ownProjects, sortBy).map(project => {
                return (
                    <EntityCard
                        key={project.id}
                        type="project"
                        name={toBranded<ProjectName>(project.name)}
                        amount={toBranded<Copia>(BigInt(project.balance))}
                        withBorder
                        p="xl"
                        radius="md"
                        extraLink={toBranded<Url>(project.url ?? "")}
                    />
                );
            })}
        </SimpleGrid>
    );
};

type Fetcher = Promise<{
    projects: Project[];
    ownProjects: Project[];
}>;

const Projects = () => {
    const [sortBy, setSortBy] = useState<SortOption>("balance-desc");

    const fetch = async () => {
        const {
            data: { id },
        } = await apis.internal.me.getCurrentUser();

        const {
            data: { items: projects },
        } = await apis.internal.projects.getProjects();
        const { data: ownProjects } = await apis.internal.users.getUserProjects(id);

        return { projects, ownProjects };
    };

    const [fetcher, setFetcher] = useState<Fetcher>(fetch());

    const refresh = () => setFetcher(fetch());

    return (
        <Flex
            direction="column"
            gap="xl"
        >
            <Flex
                direction="column"
                gap="md"
            >
                <Flex
                    direction="row"
                    align="center"
                    mr="lg"
                    gap="md"
                    wrap="wrap"
                >
                    <Flex
                        direction="row"
                        align="center"
                        wrap="wrap"
                        gap="md"
                    >
                        <Text size="xl">所有しているプロジェクト</Text>
                    </Flex>
                    <CreateNewProject onProjectCreated={refresh} />
                </Flex>
                <Suspense>
                    <OwnProjects
                        sortBy={sortBy}
                        fetcher={fetcher}
                    />
                </Suspense>
            </Flex>
            <Flex
                direction="column"
                gap="md"
            >
                <Flex
                    direction="row"
                    justify="space-between"
                    align="center"
                    wrap="wrap"
                    gap="md"
                >
                    <Text size="xl">全プロジェクト一覧</Text>
                    <Select
                        data={
                            [
                                { value: "balance-desc", label: "総資産降順" },
                                { value: "balance-asc", label: "総資産昇順" },
                                { value: "name-asc", label: "名前昇順" },
                                { value: "name-desc", label: "名前降順" },
                            ] as const
                        }
                        value={sortBy}
                        onChange={value => {
                            setSortBy(value as SortOption);
                        }}
                        allowDeselect={false}
                    />
                </Flex>
                <Suspense>
                    <AllProjects
                        sortBy={sortBy}
                        fetcher={fetcher}
                    />
                </Suspense>
            </Flex>
        </Flex>
    );
};

export default Projects;
