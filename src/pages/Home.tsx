import { Suspense, use, useCallback, useMemo, useState } from "react";

import { SimpleGrid, Stack, Title } from "@mantine/core";

import apis from "/@/api";
import type { Transaction } from "/@/api/schema/internal";
import ErrorBoundary from "/@/components/ErrorBoundary";
import { RecentTransactionsCard } from "/@/components/dashboard/RecentTransactionsCard";
import { SystemBalanceCard } from "/@/components/dashboard/SystemBalanceCard";
import { SystemCountCard } from "/@/components/dashboard/SystemCountCard";
import { SystemTotalCard } from "/@/components/dashboard/SystemTotalCard";
import { UserBalanceCard } from "/@/components/dashboard/UserBalanceCard";
import { RankingFull } from "/@/components/ranking";
import {
    RankingCardSkeleton,
    RecentTransactionsCardSkeleton,
    StatCardSkeleton,
    UserBalanceCardSkeleton,
} from "/@/components/skeletons/PageSkeletons";

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

const TopUsersRanking = ({ fetcher }: { fetcher: Promise<{ items: RankedItem<User>[] }> }) => {
    const { items } = use(fetcher);

    return (
        <RankingFull
            type="user"
            items={items}
            title="残高変動トップ 5"
            titleLink="/stats/users/difference"
            showTop3
            maxItems={5}
        />
    );
};

const WorstUsersRanking = ({ fetcher }: { fetcher: Promise<{ items: RankedItem<User>[] }> }) => {
    const { items } = use(fetcher);

    return (
        <RankingFull
            type="user"
            items={items}
            title="残高変動ワースト 5"
            titleLink="/stats/users/difference"
            showTop3
            maxItems={5}
        />
    );
};

const TopProjectsRanking = ({
    fetcher,
}: {
    fetcher: Promise<{ items: RankedItem<Project>[] }>;
}) => {
    const { items } = use(fetcher);

    return (
        <RankingFull
            type="project"
            items={items}
            title="取引総額トップ 5"
            titleLink="/stats/projects/total"
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
                transactions: data.items.slice(0, 20),
            })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [transactionsKey]
    );

    const topUsersFetcher = useMemo(
        () =>
            apis.internal.stats
                .getUserRankings("difference", {
                    term: "7days",
                    limit: 5,
                })
                .then(({ data }) => ({
                    items:
                        data.items?.map(item => ({
                            rank: item.rank,
                            rankDiff: item.difference,
                            entity: item.user,
                        })) ?? [],
                })),
        []
    );

    const worstUsersFetcher = useMemo(
        () =>
            apis.internal.stats
                .getUserRankings("difference", {
                    term: "7days",
                    limit: 5,
                    order: "asc",
                })
                .then(({ data }) => ({
                    items:
                        data.items?.map(item => ({
                            rank: item.rank,
                            rankDiff: item.difference,
                            entity: item.user,
                        })) ?? [],
                })),
        []
    );

    const topProjectsFetcher = useMemo(
        () =>
            apis.internal.stats
                .getProjectRankings("total", {
                    term: "7days",
                    limit: 5,
                })
                .then(({ data }) => ({
                    items:
                        data.items?.map(item => ({
                            rank: item.rank,
                            rankDiff: item.difference,
                            entity: item.project,
                        })) ?? [],
                })),
        []
    );

    return (
        <Stack
            gap="md"
            p="md"
        >
            <Title
                order={1}
                size="h2"
            >
                Pteron – Plutus Network
            </Title>

            <SimpleGrid
                cols={{ base: 1, xs: 2, sm: 4 }}
                spacing="md"
            >
                <ErrorBoundary>
                    <Suspense fallback={<StatCardSkeleton />}>
                        <SystemBalanceCard fetcher={systemBalanceFetcher} />
                    </Suspense>
                </ErrorBoundary>
                <ErrorBoundary>
                    <Suspense fallback={<StatCardSkeleton />}>
                        <SystemTotalCard fetcher={systemTotalFetcher} />
                    </Suspense>
                </ErrorBoundary>
                <ErrorBoundary>
                    <Suspense fallback={<StatCardSkeleton />}>
                        <SystemCountCard fetcher={systemCountFetcher} />
                    </Suspense>
                </ErrorBoundary>
                <ErrorBoundary>
                    <Suspense fallback={<UserBalanceCardSkeleton />}>
                        <UserBalanceCard fetcher={userBalanceFetcher} />
                    </Suspense>
                </ErrorBoundary>
            </SimpleGrid>

            <SimpleGrid
                cols={{ base: 1, lg: 2 }}
                spacing="md"
            >
                <ErrorBoundary>
                    <Suspense fallback={<RecentTransactionsCardSkeleton />}>
                        <RecentTransactionsCard
                            fetcher={recentTransactionsFetcher}
                            onRefresh={refreshTransactions}
                            isRefreshing={isRefreshing}
                        />
                    </Suspense>
                </ErrorBoundary>

                <ErrorBoundary>
                    <Suspense fallback={<RankingCardSkeleton />}>
                        <TopUsersRanking fetcher={topUsersFetcher} />
                    </Suspense>
                </ErrorBoundary>

                <ErrorBoundary>
                    <Suspense fallback={<RankingCardSkeleton />}>
                        <WorstUsersRanking fetcher={worstUsersFetcher} />
                    </Suspense>
                </ErrorBoundary>

                <ErrorBoundary>
                    <Suspense fallback={<RankingCardSkeleton />}>
                        <TopProjectsRanking fetcher={topProjectsFetcher} />
                    </Suspense>
                </ErrorBoundary>
            </SimpleGrid>
        </Stack>
    );
};

export default Home;
