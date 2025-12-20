import { Suspense, use } from "react";
import { useParams } from "react-router-dom";

import { Card, Center, Divider, Flex, Loader, SimpleGrid, Text, Title } from "@mantine/core";

import apis from "/@/api";
import type { Project, User } from "/@/api/schema/internal";
import type { Transaction } from "/@/api/schema/internal";
import { EntityCard } from "/@/components/EntityCard";
import ErrorBoundary from "/@/components/ErrorBoundary";
import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
import { TransactionList } from "/@/components/TransactionList";
import BalanceChart from "/@/components/ranking/BalanceChart";
import { type Copia, type ProjectName, type Url, type UserName, toBranded } from "/@/types/entity";

const UserProfileHeder = ({ name, balance }: { name: UserName; balance: Copia }) => {
    return (
        <ErrorBoundary>
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
        </ErrorBoundary>
    );
};

const UserProfileDetail = ({ transactions }: { transactions: Transaction[] }) => {
    return (
        <ErrorBoundary>
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
        </ErrorBoundary>
    );
};

const UserProfileProjectList = ({ projects }: { projects: Project[] }) => {
    return (
        <ErrorBoundary>
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
        </ErrorBoundary>
    );
};

const TheUserProfile = ({
    fetcher,
}: {
    fetcher: Promise<{ user: User; transactions: Transaction[]; projects: Project[] }>;
}) => {
    const { user, transactions, projects } = use(fetcher);

    const name = toBranded<UserName>(user.name);
    const balance = toBranded<Copia>(BigInt(user.balance));

    return (
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
    );
};

const UserProfile = () => {
    const { userId: _userName } = useParams();
    const userName = toBranded<UserName>(_userName ?? "");

    const fetch = async () => {
        const { data: user } = await apis.internal.users.getUser(userName);
        const {
            data: { items: transactions },
        } = await apis.internal.transactions.getUserTransactions(userName);

        const { data: projects } = await apis.internal.users.getUserProjects(userName);

        return { user, transactions, projects };
    };

    return (
        <ErrorBoundary>
            <Suspense
                fallback={
                    <Center h="50vh">
                        <Loader size="lg" />
                    </Center>
                }
            >
                <TheUserProfile fetcher={fetch()} />
            </Suspense>
        </ErrorBoundary>
    );
};
export default UserProfile;
