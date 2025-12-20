import { useEffect, useState } from "react";

import { Card, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconBuildingBank, IconCoin, IconReceipt2, IconWallet } from "@tabler/icons-react";

import apis from "/@/api";
import type { Project, Transaction, User } from "/@/api/schema/internal";
import { PAmount } from "/@/components/PAmount";
import { TransactionList } from "/@/components/TransactionList";
import { RankingFull } from "/@/components/ranking";
import type { RankedItem } from "/@/components/ranking/RankingTypes";
import { type Copia, toBranded } from "/@/types/entity";

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
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
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
        <Stack
            gap="md"
            p="md"
        >
            <Title order={1}>Dashboard</Title>

            <SimpleGrid
                cols={{ base: 2, sm: 4 }}
                spacing="md"
            >
                <Card
                    padding="md"
                    radius="md"
                    withBorder
                >
                    <Stack gap="md">
                        <Group
                            justify="space-between"
                            align="flex-start"
                        >
                            <Text
                                size="lg"
                                fw={600}
                            >
                                流通総額
                            </Text>
                            <IconBuildingBank
                                size={20}
                                style={{ color: "var(--mantine-color-blue-6)" }}
                            />
                        </Group>
                        {systemStats ? (
                            <PAmount
                                value={toBranded<Copia>(BigInt(systemStats.balance))}
                                leadingIcon
                                size="lg"
                                fw={700}
                            />
                        ) : (
                            <Text
                                size="lg"
                                fw={700}
                            >
                                -
                            </Text>
                        )}
                        {systemStats && (
                            <Group
                                gap="xs"
                                mt="xs"
                            >
                                <Text
                                    size="xs"
                                    c={systemStats.difference >= 0 ? "green" : "red"}
                                >
                                    {systemStats.difference >= 0 ? "+" : ""}
                                    {systemStats.difference.toLocaleString()}
                                </Text>
                                <Text
                                    size="xs"
                                    c="dimmed"
                                >
                                    過去7日
                                </Text>
                            </Group>
                        )}
                    </Stack>
                </Card>

                <Card
                    padding="md"
                    radius="md"
                    withBorder
                >
                    <Stack gap="md">
                        <Group
                            justify="space-between"
                            align="flex-start"
                        >
                            <Text
                                size="lg"
                                fw={600}
                            >
                                総取引額
                            </Text>
                            <IconCoin
                                size={20}
                                style={{ color: "var(--mantine-color-green-6)" }}
                            />
                        </Group>
                        {systemStats ? (
                            <PAmount
                                value={toBranded<Copia>(BigInt(systemStats.total))}
                                leadingIcon
                                size="lg"
                                fw={700}
                            />
                        ) : (
                            <Text
                                size="lg"
                                fw={700}
                            >
                                -
                            </Text>
                        )}
                        {systemStats && (
                            <Text
                                size="xs"
                                c="dimmed"
                                mt="xs"
                            >
                                過去7日
                            </Text>
                        )}
                    </Stack>
                </Card>

                <Card
                    padding="md"
                    radius="md"
                    withBorder
                >
                    <Stack gap="md">
                        <Group
                            justify="space-between"
                            align="flex-start"
                        >
                            <Text
                                size="lg"
                                fw={600}
                            >
                                取引件数
                            </Text>
                            <IconReceipt2
                                size={20}
                                style={{ color: "var(--mantine-color-orange-6)" }}
                            />
                        </Group>
                        <Text
                            size="lg"
                            fw={700}
                        >
                            {systemStats ? systemStats.count.toLocaleString() : "-"}
                        </Text>
                        {systemStats && (
                            <Text
                                size="xs"
                                c="dimmed"
                                mt="xs"
                            >
                                過去7日
                            </Text>
                        )}
                    </Stack>
                </Card>

                <Card
                    padding="md"
                    radius="md"
                    withBorder
                    style={{ borderColor: "var(--mantine-color-violet-light)" }}
                >
                    <Stack gap="md">
                        <Group
                            justify="space-between"
                            align="flex-start"
                        >
                            <Text
                                size="lg"
                                fw={600}
                            >
                                あなたの残高
                            </Text>
                            <IconWallet
                                size={20}
                                style={{ color: "var(--mantine-color-violet-6)" }}
                            />
                        </Group>
                        <PAmount
                            value={toBranded<Copia>(BigInt(calculatedBalance))}
                            leadingIcon
                            size="lg"
                            fw={700}
                        />
                        <Group
                            gap="xs"
                            mt="xs"
                        >
                            <Text
                                size="xs"
                                c={recentBalanceChange >= 0 ? "green" : "red"}
                            >
                                {recentBalanceChange >= 0 ? "+" : ""}
                                {recentBalanceChange.toLocaleString()}
                            </Text>
                            <Text
                                size="xs"
                                c="dimmed"
                            >
                                直近10件
                            </Text>
                        </Group>
                    </Stack>
                </Card>
            </SimpleGrid>

            <SimpleGrid
                cols={{ base: 1, lg: 2 }}
                spacing="md"
            >
                <Card
                    padding="lg"
                    radius="md"
                    withBorder
                    style={{ display: "flex", flexDirection: "column" }}
                >
                    <Stack gap="md">
                        <Text
                            size="lg"
                            fw={600}
                        >
                            最近の取引
                        </Text>
                        <div className="h-80 overflow-auto">
                            <TransactionList
                                transactions={transactions}
                                direction="both"
                            />
                        </div>
                    </Stack>
                </Card>

                <RankingFull
                    type="user"
                    items={topUsers}
                    title="残高変動トップ 5"
                    showTop3
                    maxItems={5}
                />

                <RankingFull
                    type="user"
                    items={worstUsers}
                    title="ワースト 5"
                    showTop3
                    maxItems={5}
                />

                <RankingFull
                    type="project"
                    items={featuredProjects}
                    title="注目プロジェクト トップ 5"
                    showTop3
                    maxItems={5}
                />
            </SimpleGrid>
        </Stack>
    );
};

export default Home;
