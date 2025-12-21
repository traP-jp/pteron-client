import { Suspense, use, useMemo } from "react";
import { useParams } from "react-router-dom";

import { Card, Center, Divider, Flex, Loader, SimpleGrid, Stack, Text } from "@mantine/core";

import apis from "/@/api";
import type { Project, User } from "/@/api/schema/internal";
import type { Transaction } from "/@/api/schema/internal";
import { EntityCard } from "/@/components/EntityCard";
import ErrorBoundary from "/@/components/ErrorBoundary";
import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
import { TransactionList } from "/@/components/TransactionList";
import BalanceChart from "/@/components/ranking/BalanceChart";
import { UserRankingBadges, UserRankingCards } from "/@/components/ranking/RankingBadges";
import { type Copia, type ProjectName, type Url, type UserName, toBranded } from "/@/types/entity";

const UserProfileHeder = ({ name, balance }: { name: UserName; balance: Copia }) => {
    return (
        <ErrorBoundary>
            <Flex
                direction="column"
                mt="lg"
                mb="xs"
                gap="sm"
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
                        compact
                        size="custom"
                        customSize={2}
                    />
                </Flex>
                <Flex ml="xl">
                    <UserRankingBadges userName={name} />
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
                    <Text
                        size="xl"
                        fw={400}
                        mb="md"
                    >
                        推移
                    </Text>
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
                    <Text
                        size="xl"
                        fw={400}
                        mb="md"
                    >
                        取引履歴
                    </Text>
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
            <Text
                size="xl"
                fw={400}
            >
                所属しているプロジェクト
            </Text>

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
    const { user, transactions: _transactions, projects } = use(fetcher);
    const transactions = _transactions.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    const name = toBranded<UserName>(user.name);
    const balance = toBranded<Copia>(BigInt(user.balance));

    return (
        <Stack
            gap="md"
            p="md"
        >
            <UserProfileHeder
                name={name}
                balance={balance}
            />
            <Divider />
            <UserProfileDetail transactions={transactions} />
            <Divider />
            <UserProfileProjectList projects={projects} />
            <Divider />
            <ErrorBoundary>
                <Text
                    size="xl"
                    fw={400}
                >
                    ランキング
                </Text>
                <UserRankingCards userName={name} />
            </ErrorBoundary>
        </Stack>
    );
};

const UserProfile = () => {
    const { userId: _userName } = useParams();
    const userName = toBranded<UserName>(_userName ?? "");

    const fetcher = useMemo(
        () =>
            Promise.all([
                apis.internal.users.getUser(userName),
                apis.internal.transactions.getUserTransactions(userName),
                apis.internal.users.getUserProjects(userName),
            ]).then(([userRes, transRes, projectsRes]) => {
                // APIスキーマは Project[] だが、本番APIは { items: [...] } を返す場合がある
                const projectsData = projectsRes.data;
                const projects = Array.isArray(projectsData)
                    ? projectsData
                    : (projectsData as unknown as { items: typeof projectsData }).items;
                return {
                    user: userRes.data,
                    transactions: transRes.data.items,
                    projects,
                };
            }),
        [userName]
    );

    return (
        <ErrorBoundary>
            <Suspense
                fallback={
                    <Stack
                        gap="md"
                        p="md"
                    >
                        <Center h="50vh">
                            <Loader size="lg" />
                        </Center>
                    </Stack>
                }
            >
                <TheUserProfile fetcher={fetcher} />
            </Suspense>
        </ErrorBoundary>
    );
};
export default UserProfile;
