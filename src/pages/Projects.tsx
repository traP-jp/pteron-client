import { useEffect, useState } from "react";

import { Button, Flex, SimpleGrid, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

import apis from "../api";
import type { Project } from "../api/schema/internal";
import { CreateProjectModal } from "../components/CreateProjectModal";
import { EntityCard } from "../components/EntityCard";
import { type Copia, type ProjectName, type Url, type UserId, toBranded } from "../types/entity";

const CreateNewProject = () => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <CreateProjectModal
                opened={opened}
                onClose={close}
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

const Projects = () => {
    const [myId, setMyId] = useState<UserId>();
    const [projects, setProjects] = useState<Project[]>([]);
    const [haveProjects, setHaveProjects] = useState<Project[]>([]);

    useEffect(() => {
        apis.internal.me.getCurrentUser().then(({ data }) => {
            setMyId(toBranded<UserId>(data.id));
        });
    }, []);

    useEffect(() => {
        apis.internal.projects.getProjects().then(({ data }) => {
            setProjects(data.items);
        });
    }, []);

    useEffect(() => {
        if (!myId) return;
        apis.internal.users.getUserProjects(myId).then(({ data }) => {
            setHaveProjects(data);
        });
    }, [myId]);

    return (
        <>
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
                        gap="xl"
                    >
                        <Text size="xl">所有しているプロジェクト</Text>
                        <CreateNewProject />
                    </Flex>
                    <SimpleGrid
                        cols={{ base: 1, md: 2, xl: 3 }}
                        spacing="md"
                    >
                        {haveProjects.map(project => {
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
                </Flex>
                <Flex
                    direction="column"
                    gap="md"
                >
                    <Text size="xl">全プロジェクト一覧</Text>
                    <SimpleGrid
                        cols={{ base: 1, md: 2, xl: 3 }}
                        spacing="md"
                    >
                        {projects.map(project => {
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
                </Flex>
            </Flex>
        </>
    );
};

export default Projects;
