import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Card, Flex, Grid, Text } from "@mantine/core";

import apis from "/@/api";
import type { Project, User } from "/@/api/schema/internal";
import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
import { type Copia, type ProjectName, type Url, type UserName, toBranded } from "/@/types/entity";

import type { Transaction } from "../api/schema/internal";
import { EntityCard } from "../components/EntityCard";
import { TransactionList } from "../components/TransactionList";

function UserProfileTop({ name, balance }: { name: UserName; balance: Copia }) {
    return (
        <>
            <Card
                padding="xs"
                p="lg"
                withBorder
                radius="md"
            >
                <Flex direction="column">
                    <Flex
                        direction="row"
                        align="center"
                    >
                        <Flex
                            direction="row"
                            align="center"
                            gap="xl"
                            ml="xl"
                        >
                            <PAvatar
                                size="xl"
                                name={name}
                                type="user"
                            />
                            <Text
                                size="xl"
                                fw={700}
                            >
                                {name}
                            </Text>
                        </Flex>
                        <PAmount
                            ml="auto"
                            mr="xl"
                            value={balance}
                            leadingIcon
                            coloring
                            size="custom"
                            customSize={2}
                        />
                    </Flex>
                </Flex>
            </Card>
        </>
    );
}

function UserProfileMiddle({ transactions }: { transactions: Transaction[] }) {
    // TODO: グラフ
    return (
        <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
                <Card
                    withBorder
                    radius="md"
                    p="lg"
                    h="100%"
                >
                    <Text
                        size="xl"
                        mb="md"
                    >
                        概要
                    </Text>
                    <Text>グラフとか入る予定</Text>
                </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
                <Card
                    withBorder
                    radius="md"
                    p="lg"
                    h="100%"
                    style={{ display: "flex", flexDirection: "column" }}
                >
                    <Text
                        size="xl"
                        mb="md"
                    >
                        取引履歴
                    </Text>
                    {transactions.length === 0 && <Text c="dimmed">取引履歴がありません</Text>}
                    <div style={{ overflow: "auto", height: "20rem" }}>
                        <TransactionList
                            transactions={transactions.concat(transactions)}
                            currentType="user"
                        />
                    </div>
                </Card>
            </Grid.Col>
        </Grid>
    );
}

function UserProfileBottom({ projects }: { projects: Project[] }) {
    return (
        <>
            <Text
                size="xl"
                // mb="md"
            >
                所属しているプロジェクト
            </Text>
            <Grid>
                {projects.map(project => (
                    <Grid.Col
                        span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                        key={project.id}
                    >
                        <EntityCard
                            p="xl"
                            withBorder
                            radius="md"
                            type="project"
                            amount={toBranded<Copia>(BigInt(project.balance))}
                            name={toBranded<ProjectName>(project.name)}
                            extraLink={project.url ? toBranded<Url>(project.url) : undefined}
                        />
                    </Grid.Col>
                ))}
            </Grid>
        </>
    );
}

const UserProfile = () => {
    const { userId: _userName } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [userProjects, setUserProjects] = useState<Project[]>([]);

    useEffect(() => {
        apis.internal.users.getUser(_userName!).then(({ data }) => {
            setUser(data);
        });
    }, [_userName]);

    useEffect(() => {
        if (!user) return;
        apis.internal.transactions.getUserTransactions(user.name).then(({ data }) => {
            setTransactions(data.items);
        });
    }, [user]);

    useEffect(() => {
        if (!user) return;

        apis.internal.users.getUserProjects(user.name).then(({ data }) => {
            setUserProjects(data);
        });
    }, [user]);

    if (!user) return <></>;

    const name = toBranded<UserName>(user.name);
    const balance = toBranded<Copia>(BigInt(user.balance));
    const projects = toBranded<Project[]>(userProjects);

    return (
        <>
            <Flex
                direction="column"
                gap="md"
            >
                <UserProfileTop
                    name={name}
                    balance={balance}
                />
                <UserProfileMiddle transactions={transactions} />
                <UserProfileBottom projects={projects} />
            </Flex>
        </>
    );
};

export default UserProfile;
