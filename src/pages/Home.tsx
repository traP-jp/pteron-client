import { useEffect, useState } from "react";

import { SimpleGrid, Stack, Text, Title } from "@mantine/core";

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

export const Home = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
    const [systemStats, setSystemStats] = useState<{
        balance: number;
        count: number;
        difference: number;
        ratio: number;
        total: number;
    } | null>(null);

    useEffect(() => {
        apis.internal.me.getCurrentUser().then(({ data }) => {
            setCurrentUser(data);
            apis.internal.transactions.getUserTransactions(data.name).then(({ data }) => {
                setUserTransactions(data.items);
            });
        });

        apis.internal.users.getUsers().then(({ data }) => {
            setUsers(data.items);
        });

        apis.internal.projects.getProjects().then(({ data }) => {
            setProjects(data.items);
        });

        apis.internal.transactions.getTransactions().then(({ data }) => {
            setTransactions(data.items);
        });

        apis.internal.stats.getSystemStats({ term: "7days" }).then(({ data }) => {
            setSystemStats(data);
        });
    }, []);

    // データが読み込まれるまでローディング表示
    if (!currentUser) {
        return (
            <Stack
                gap="xl"
                p="md"
            >
                <Title order={1}>Dashboard</Title>
                <Text>Loading...</Text>
            </Stack>
        );
    }

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

    const calculatedBalance = calculateBalance(userTransactions);

    const recentTransactions = [...userTransactions]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);

    const recentBalanceChange = recentTransactions.reduce((acc, tx) => {
        if (tx.type === "TRANSFER") {
            return acc + tx.amount;
        } else if (tx.type === "BILL_PAYMENT") {
            return acc - tx.amount;
        }
        return acc;
    }, 0);

    const sortedUsers = [...users].sort((a, b) => b.balance - a.balance);

    const topUsers: RankedItem<User>[] = sortedUsers.slice(0, 5).map((user, index) => ({
        rank: index + 1,
        rankDiff: index === 0 ? 1 : index === 1 ? -1 : 0,
        entity: user,
    }));

    const worstUsers: RankedItem<User>[] = [...users]
        .sort((a, b) => a.balance - b.balance)
        .slice(0, 5)
        .map((user, index) => ({
            rank: index + 1,
            rankDiff: index === 0 ? 1 : index === 1 ? -1 : index === 2 ? 2 : 0,
            entity: user,
        }));

    const featuredProjects: RankedItem<Project>[] = [...projects]
        .sort((a, b) => b.balance - a.balance)
        .slice(0, 5)
        .map((project, index) => ({
            rank: index + 1,
            rankDiff: index === 0 ? 1 : index === 1 ? -1 : 0,
            entity: project,
        }));

    return (
        <ErrorBoundary>
            <Stack
                gap="md"
                p="md"
            >
                <Title order={1}>Dashboard</Title>

                {systemStats && (
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
                )}

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
        </ErrorBoundary>
    );
};

export default Home;
