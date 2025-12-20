import { Suspense, use, useState } from "react";

import { Center, Flex, Loader, Select, SimpleGrid, Text } from "@mantine/core";

import apis from "/@/api";
import type { User } from "/@/api/schema/internal";
import { EntityCard } from "/@/components/EntityCard";
import ErrorBoundary from "/@/components/ErrorBoundary";
import { type Copia, type UserName, toBranded } from "/@/types/entity";

type SortOption = "balance-desc" | "balance-asc" | "name-asc" | "name-desc";

const TheUsers = ({ fetcher }: { fetcher: Promise<User[]> }) => {
    const [sortBy, setSortBy] = useState<SortOption>("balance-desc");
    const users = use(fetcher);

    if (!users) return <></>;

    users.sort((a, b) => {
        switch (sortBy) {
            case "balance-desc":
                return b.balance - a.balance;
            case "balance-asc":
                return a.balance - b.balance;
            case "name-asc":
                return a.name.localeCompare(b.name);
            case "name-desc":
                return b.name.localeCompare(a.name);
            default:
                return 0;
        }
    });

    return (
        <>
            <Flex
                direction="row"
                justify="space-between"
                align="center"
                wrap="wrap"
                mb="md"
            >
                <Text
                    fw={700}
                    size="xl"
                >
                    ユーザー一覧
                </Text>
                <Select
                    data={[
                        { value: "balance-desc", label: "総資産降順" },
                        { value: "balance-asc", label: "総資産昇順" },
                        { value: "name-asc", label: "名前昇順" },
                        { value: "name-desc", label: "名前降順" },
                    ]}
                    value={sortBy}
                    onChange={value => setSortBy(value as SortOption)}
                    allowDeselect={false}
                />
            </Flex>
            <SimpleGrid
                cols={{ base: 1, md: 2, xl: 3 }}
                spacing="md"
            >
                {users.map(user => (
                    <EntityCard
                        key={user.id}
                        type="user"
                        name={toBranded<UserName>(user.name)}
                        amount={toBranded<Copia>(BigInt(user.balance))}
                        withBorder
                        p="xl"
                        radius="md"
                        style={{ minWidth: 300 }}
                    />
                ))}
            </SimpleGrid>
        </>
    );
};

export const Users = () => {
    const fetch = async () => {
        const {
            data: { items: users },
        } = await apis.internal.users.getUsers();

        return users;
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
                <TheUsers fetcher={fetch()} />
            </Suspense>
        </ErrorBoundary>
    );
};

export default Users;
