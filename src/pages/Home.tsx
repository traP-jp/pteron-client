import { Suspense, use, useMemo } from "react";

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

interface HomeData {
    users: User[];
    projects: Project[];
    transactions: Transaction[];
    userTransactions: Transaction[];
    systemStats: {
        balance: number;
        count: number;
        difference: number;
        ratio: number;
        total: number;
    };
}

const TheHome = ({ fetcher }: { fetcher: Promise<HomeData> }) => {
    const { users, projects, transactions, userTransactions, systemStats } = use(fetcher);

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

    const calculatedBalance = useMemo(() => calculateBalance(userTransactions), [userTransactions]);

    const recentTransactions = useMemo(
        () =>
            [...userTransactions]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 10),
        [userTransactions]
    );

    const recentBalanceChange = useMemo(
        () =>
            recentTransactions.reduce((acc, tx) => {
                if (tx.type === "TRANSFER") {
                    return acc + tx.amount;
                } else if (tx.type === "BILL_PAYMENT") {
                    return acc - tx.amount;
                }
                return acc;
            }, 0),
        [recentTransactions]
    );

    const topUsers: RankedItem<User>[] = useMemo(
        () =>
            [...users]
                .sort((a, b) => b.balance - a.balance)
                .slice(0, 5)
                .map((user, index) => ({
                    rank: index + 1,
                    rankDiff: index === 0 ? 1 : index === 1 ? -1 : 0,
                    entity: user,
                })),
        [users]
    );

    const worstUsers: RankedItem<User>[] = useMemo(
        () =>
            [...users]
                .sort((a, b) => a.balance - b.balance)
                .slice(0, 5)
                .map((user, index) => ({
                    rank: index + 1,
                    rankDiff: index === 0 ? 1 : index === 1 ? -1 : index === 2 ? 2 : 0,
                    entity: user,
                })),
        [users]
    );

    const featuredProjects: RankedItem<Project>[] = useMemo(
        () =>
            [...projects]
                .sort((a, b) => b.balance - a.balance)
                .slice(0, 5)
                .map((project, index) => ({
                    rank: index + 1,
                    rankDiff: index === 0 ? 1 : index === 1 ? -1 : 0,
                    entity: project,
                })),
        [projects]
    );

    return (
        <Stack
            gap="md"
            p="md"
        >
            <Title order={1}>Dashboard</Title>

            <SimpleGrid
                cols={{ base: 2, sm: 4 }}
                spacing="md"
            >
                <SystemBalanceCard
                    balance={systemStats.balance}
                    difference={systemStats.difference}
                />
                <SystemTotalCard total={systemStats.total} />
                <SystemCountCard count={systemStats.count} />
                <UserBalanceCard
                    balance={calculatedBalance}
                    recentChange={recentBalanceChange}
                />
            </SimpleGrid>

            <SimpleGrid
                cols={{ base: 1, lg: 2 }}
                spacing="md"
            >
                <RecentTransactionsCard transactions={transactions} />

                <ErrorBoundary>
                    <RankingFull
                        type="user"
                        items={topUsers}
                        title="残高変動トップ 5"
                        showTop3
                        maxItems={5}
                    />
                </ErrorBoundary>

                <ErrorBoundary>
                    <RankingFull
                        type="user"
                        items={worstUsers}
                        title="ワースト 5"
                        showTop3
                        maxItems={5}
                    />
                </ErrorBoundary>

                <ErrorBoundary>
                    <RankingFull
                        type="project"
                        items={featuredProjects}
                        title="注目プロジェクト トップ 5"
                        showTop3
                        maxItems={5}
                    />
                </ErrorBoundary>
            </SimpleGrid>
        </Stack>
    );
};

export const Home = () => {
    const fetcher = useMemo(
        () =>
            Promise.all([
                apis.internal.me.getCurrentUser(),
                apis.internal.users.getUsers(),
                apis.internal.projects.getProjects(),
                apis.internal.transactions.getTransactions(),
                apis.internal.stats.getSystemStats({ term: "7days" }),
            ]).then(async ([currentUserRes, usersRes, projectsRes, transactionsRes, statsRes]) => {
                const { data: userTransactionsRes } =
                    await apis.internal.transactions.getUserTransactions(currentUserRes.data.name);

                return {
                    users: usersRes.data.items,
                    projects: projectsRes.data.items,
                    transactions: transactionsRes.data.items,
                    userTransactions: userTransactionsRes.items,
                    systemStats: statsRes.data,
                };
            }),
        []
    );

    return (
        <ErrorBoundary>
            <Suspense
                fallback={
                    <Stack
                        gap="md"
                        p="md"
                    >
                        <Title order={1}>Dashboard</Title>
                        <Center h="50vh">
                            <Loader size="lg" />
                        </Center>
                    </Stack>
                }
            >
                <TheHome fetcher={fetcher} />
            </Suspense>
        </ErrorBoundary>
    );
};

export default Home;
