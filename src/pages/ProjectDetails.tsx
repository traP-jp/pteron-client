import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Card, Divider, Flex, SimpleGrid, Text, Title } from "@mantine/core";

import apis from "/@/api";
import type { Project, User } from "/@/api/schema/internal";
import type { Transaction } from "/@/api/schema/internal";
import { EntityCard } from "/@/components/EntityCard";
import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
import { TransactionList } from "/@/components/TransactionList";
import BalanceChart from "/@/components/ranking/BalanceChart";
import { type Copia, type ProjectName, type Url, type UserName, toBranded } from "/@/types/entity";

const UserProfileHeder = ({ name, balance }: { name: UserName; balance: Copia }) => {
    return (
        <>
            <Flex
                direction="column"
                mt="lg"
                mb="xs"
            >
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
        </>
    );
};

const UserProfileDetail = ({ transactions }: { transactions: Transaction[] }) => {
    return (
        <Flex
            wrap="wrap"
            direction="row"
            gap="md"
        >
            <Card
                className="flex-auto"
                p="lg"
                h="100%"
            >
                <Title
                    order={2}
                    fw={400}
                    mb="md"
                >
                    推移
                </Title>
                <BalanceChart
                    h={320}
                    transactions={transactions}
                />
            </Card>

            <Divider orientation="vertical" />

            <Card
                className="min-w-md"
                p="lg"
                h="100%"
                style={{ display: "flex", flexDirection: "column" }}
            >
                <Title
                    order={2}
                    fw={400}
                    mb="md"
                >
                    取引履歴
                </Title>
                {!transactions && <Text c="dimmed">取引履歴がありません</Text>}
                <div className="h-80 overflow-auto">
                    <TransactionList
                        transactions={transactions}
                        currentType="user"
                    />
                </div>
            </Card>
        </Flex>
    );
};

const UserProfileProjectList = ({ projects }: { projects: Project[] }) => {
    return (
        <>
            <Title
                order={2}
                fw={400}
            >
                所属しているプロジェクト
            </Title>

            <SimpleGrid
                cols={{ base: 1, md: 2, xl: 3 }}
                spacing="md"
            >
                {projects.map(({ id, balance, name, url }) => (
                    <EntityCard
                        key={id}
                        p="xl"
                        withBorder
                        radius="md"
                        type="project"
                        amount={toBranded<Copia>(BigInt(balance))}
                        name={toBranded<ProjectName>(name)}
                        extraLink={url ? toBranded<Url>(url) : undefined}
                    />
                ))}
            </SimpleGrid>
        </>
    );
};

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
        apis.internal.transactions.getUserTransactions(_userName!).then(({ data }) => {
            setTransactions(data.items);
        });
    }, [_userName]);

    useEffect(() => {
        apis.internal.users.getUserProjects(_userName!).then(({ data }) => {
            setUserProjects(data);
        });
    }, [_userName]);

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
                <UserProfileHeder
                    name={name}
                    balance={balance}
                />
                <Divider />
                <UserProfileDetail transactions={transactions} />
                <Divider />
                <UserProfileProjectList projects={projects} />
            </Flex>
        </>
    );
};

export default UserProfile;
