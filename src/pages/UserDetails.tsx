import { Suspense, use, useMemo } from "react";
import { useParams } from "react-router-dom";

import { Card, Divider, Flex, SimpleGrid, Text, Title } from "@mantine/core";

import apis from "/@/api";
import type { Project, Transaction } from "/@/api/schema/internal";
import { EntityCard } from "/@/components/EntityCard";
import ErrorBoundary from "/@/components/ErrorBoundary";
import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
import { TransactionList } from "/@/components/TransactionList";
import BalanceChart from "/@/components/ranking/BalanceChart";
import { UserRankingBadges, UserRankingCards } from "/@/components/ranking/RankingBadges";
import { UserDetailsSkeleton } from "/@/components/skeletons/PageSkeletons";
import { type Copia, type ProjectName, type Url, type UserName, toBranded } from "/@/types/entity";

interface UserHeaderData {
    name: UserName;
    balance: Copia;
}

const UserProfileHeader = ({ fetcher }: { fetcher: Promise<UserHeaderData> }) => {
    const { name, balance } = use(fetcher);

    return (
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
    );
};

const UserProfileDetail = ({ fetcher }: { fetcher: Promise<Transaction[]> }) => {
    const transactions = use(fetcher);

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

const UserProfileProjectList = ({ fetcher }: { fetcher: Promise<Project[]> }) => {
    const projects = use(fetcher);

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
    const userName = toBranded<UserName>(_userName ?? "");

    const userHeaderFetcher = useMemo(
        () =>
            apis.internal.users.getUser(userName).then(({ data }) => ({
                name: toBranded<UserName>(data.name),
                balance: toBranded<Copia>(BigInt(data.balance)),
            })),
        [userName]
    );

    const transactionsFetcher = useMemo(
        () =>
            apis.internal.transactions.getUserTransactions(userName).then(({ data }) => {
                return data.items.sort((a, b) => {
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                });
            }),
        [userName]
    );

    const projectsFetcher = useMemo(
        () =>
            apis.internal.users.getUserProjects(userName).then(({ data }) => {
                // APIスキーマは Project[] だが、本番APIは { items: [...] } を返す場合がある
                const projectsData = data;
                const projects = Array.isArray(projectsData)
                    ? projectsData
                    : (projectsData as unknown as { items: typeof projectsData }).items;
                return projects;
            }),
        [userName]
    );

    return (
        <ErrorBoundary>
            <Suspense fallback={<UserDetailsSkeleton />}>
                <Flex
                    direction="column"
                    gap="md"
                >
                    <UserProfileHeader fetcher={userHeaderFetcher} />
                    <Divider />
                    <UserProfileDetail fetcher={transactionsFetcher} />
                    <Divider />
                    <UserProfileProjectList fetcher={projectsFetcher} />
                    <Divider />
                    <Title
                        order={2}
                        fw={400}
                    >
                        ランキング
                    </Title>
                    <UserRankingCards userName={userName} />
                </Flex>
            </Suspense>
        </ErrorBoundary>
    );
};
export default UserProfile;
