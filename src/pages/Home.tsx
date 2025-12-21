import { Suspense, use, useCallback, useMemo, useState } from "react";

import { Center, Loader, SimpleGrid, Stack, Title } from "@mantine/core";

import apis from "/@/api";
import type { Project, Transaction, User } from "/@/api/schema/internal";
import ErrorBoundary from "/@/components/ErrorBoundary";
import { RecentTransactionsCard } from "/@/components/dashboard/RecentTransactionsCard";
import { SystemBalanceCard } from "/@/components/dashboard/SystemBalanceCard";
import { SystemCountCard } from "/@/components/dashboard/SystemCountCard";
import { SystemTotalCard } from "/@/components/dashboard/SystemTotalCard";
import { UserBalanceCard } from "/@/components/dashboard/UserBalanceCard";
import { RankingFull } from "/@/components/ranking";
import type { RankedItem } from "/@/components/ranking/RankingTypes";

// トランザクション履歴から残高を逆算
// TRANSFER (プロジェクト→ユーザー): 残高増加
// BILL_PAYMENT (ユーザー→プロジェクト): 残高減少
const calculateBalance = (txs: Transaction[]): number => {
    return txs.reduce((acc, tx) => {
        if (tx.type === "TRANSFER") {
            return acc + tx.amount;
        } else if (tx.type === "BILL_PAYMENT") {
            return acc - tx.amount;
        }
        return acc;
    }, 0);
};

const TopUsersRanking = ({ fetcher }: { fetcher: Promise<RankedItem<User>[]> }) => {
    const topUsers = use(fetcher);

    return (
        <RankingFull
            type="user"
            items={topUsers}
            title="残高変動トップ 5"
            showTop3
            maxItems={5}
        />
    );
};

const WorstUsersRanking = ({ fetcher }: { fetcher: Promise<RankedItem<User>[]> }) => {
    const worstUsers = use(fetcher);

    return (
        <RankingFull
            type="user"
            items={worstUsers}
            title="ワースト 5"
            showTop3
            maxItems={5}
        />
    );
};

const FeaturedProjectsRanking = ({ fetcher }: { fetcher: Promise<RankedItem<Project>[]> }) => {
    const featuredProjects = use(fetcher);

    return (
        <RankingFull
            type="project"
            items={featuredProjects}
            title="注目プロジェクト トップ 5"
            showTop3
            maxItems={5}
        />
    );
};

export const Home = () => {
    const [transactionsKey, setTransactionsKey] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshTransactions = useCallback(async () => {
        setIsRefreshing(true);
        setTransactionsKey(prev => prev + 1);
        setIsRefreshing(false);
    }, []);

    const systemBalanceFetcher = useMemo(
        () =>
            apis.internal.stats
                .getSystemStats({ term: "7days" })
                .then(({ data }) => ({
                    balance: data.balance,
                    difference: data.difference,
                }))
                .catch(() => ({ balance: undefined, difference: undefined })),
        []
    );

    const systemTotalFetcher = useMemo(
        () =>
            apis.internal.stats
                .getSystemStats({ term: "7days" })
                .then(({ data }) => ({ total: data.total }))
                .catch(() => ({ total: undefined })),
        []
    );

    const systemCountFetcher = useMemo(
        () =>
            apis.internal.stats
                .getSystemStats({ term: "7days" })
                .then(({ data }) => ({ count: data.count }))
                .catch(() => ({ count: undefined })),
        []
    );

    const userBalanceFetcher = useMemo(
        () =>
            apis.internal.me.getCurrentUser().then(async ({ data: user }) => {
                const { data: userTransactionsRes } =
                    await apis.internal.transactions.getUserTransactions(user.name);

                const userTransactions = userTransactionsRes.items;
                const calculatedBalance = calculateBalance(userTransactions);

                const recentTransactions = [...userTransactions]
                    .sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                    .slice(0, 10);

                const recentBalanceChange = recentTransactions.reduce((acc, tx) => {
                    if (tx.type === "TRANSFER") {
                        return acc + tx.amount;
                    } else if (tx.type === "BILL_PAYMENT") {
                        return acc - tx.amount;
                    }
                    return acc;
                }, 0);

                return { balance: calculatedBalance, recentChange: recentBalanceChange };
            }),
        []
    );

    const recentTransactionsFetcher = useMemo(
        () =>
            apis.internal.transactions.getTransactions().then(({ data }) => ({
                transactions: data.items,
            })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [transactionsKey]
    );

    const topUsersFetcher = useMemo(
        () =>
            apis.internal.users.getUsers().then(({ data }) => {
                const users = data.items;
                return [...users]
                    .sort((a, b) => b.balance - a.balance)
                    .slice(0, 5)
                    .map((user, index) => ({
                        rank: index + 1,
                        rankDiff: index === 0 ? 1 : index === 1 ? -1 : 0,
                        entity: user,
                    }));
            }),
        []
    );

    const worstUsersFetcher = useMemo(
        () =>
            apis.internal.users.getUsers().then(({ data }) => {
                const users = data.items;
                return [...users]
                    .sort((a, b) => a.balance - b.balance)
                    .slice(0, 5)
                    .map((user, index) => ({
                        rank: index + 1,
                        rankDiff: index === 0 ? 1 : index === 1 ? -1 : index === 2 ? 2 : 0,
                        entity: user,
                    }));
            }),
        []
    );

    const featuredProjectsFetcher = useMemo(
        () =>
            apis.internal.projects.getProjects().then(({ data }) => {
                const projects = data.items;
                return [...projects]
                    .sort((a, b) => b.balance - a.balance)
                    .slice(0, 5)
                    .map((project, index) => ({
                        rank: index + 1,
                        rankDiff: index === 0 ? 1 : index === 1 ? -1 : 0,
                        entity: project,
                    }));
            }),
        []
    );

    return (
        <Stack
            gap="md"
            p="md"
        >
            <Title order={1}>Pteron – Plutus Network</Title>

            <SimpleGrid
                cols={{ base: 2, sm: 4 }}
                spacing="md"
            >
                <ErrorBoundary>
                    <Suspense
                        fallback={
                            <Center>
                                <Loader size="sm" />
                            </Center>
                        }
                    >
                        <SystemBalanceCard fetcher={systemBalanceFetcher} />
                    </Suspense>
                </ErrorBoundary>
                <ErrorBoundary>
                    <Suspense
                        fallback={
                            <Center>
                                <Loader size="sm" />
                            </Center>
                        }
                    >
                        <SystemTotalCard fetcher={systemTotalFetcher} />
                    </Suspense>
                </ErrorBoundary>
                <ErrorBoundary>
                    <Suspense
                        fallback={
                            <Center>
                                <Loader size="sm" />
                            </Center>
                        }
                    >
                        <SystemCountCard fetcher={systemCountFetcher} />
                    </Suspense>
                </ErrorBoundary>
                <ErrorBoundary>
                    <Suspense
                        fallback={
                            <Center>
                                <Loader size="sm" />
                            </Center>
                        }
                    >
                        <UserBalanceCard fetcher={userBalanceFetcher} />
                    </Suspense>
                </ErrorBoundary>
            </SimpleGrid>

            <SimpleGrid
                cols={{ base: 1, lg: 2 }}
                spacing="md"
            >
                <ErrorBoundary>
                    <Suspense
                        fallback={
                            <Center py="xl">
                                <Loader size="lg" />
                            </Center>
                        }
                    >
                        <RecentTransactionsCard
                            fetcher={recentTransactionsFetcher}
                            onRefresh={refreshTransactions}
                            isRefreshing={isRefreshing}
                        />
                    </Suspense>
                </ErrorBoundary>

                <ErrorBoundary>
                    <Suspense
                        fallback={
                            <Center py="xl">
                                <Loader size="lg" />
                            </Center>
                        }
                    >
                        <TopUsersRanking fetcher={topUsersFetcher} />
                    </Suspense>
                </ErrorBoundary>

                <ErrorBoundary>
                    <Suspense
                        fallback={
                            <Center py="xl">
                                <Loader size="lg" />
                            </Center>
                        }
                    >
                        <WorstUsersRanking fetcher={worstUsersFetcher} />
                    </Suspense>
                </ErrorBoundary>

                <ErrorBoundary>
                    <Suspense
                        fallback={
                            <Center py="xl">
                                <Loader size="lg" />
                            </Center>
                        }
                    >
                        <FeaturedProjectsRanking fetcher={featuredProjectsFetcher} />
                    </Suspense>
                </ErrorBoundary>
            </SimpleGrid>
        </Stack>
    );
};

export default Home;
