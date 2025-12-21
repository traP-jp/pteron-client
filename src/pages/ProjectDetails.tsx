import { Suspense, use } from "react";
import { useParams } from "react-router-dom";

import {
    ActionIcon,
    Button,
    Card,
    Center,
    Divider,
    Flex,
    Loader,
    SimpleGrid,
    Text,
    Title,
} from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";

import apis from "/@/api";
import type { Project, User } from "/@/api/schema/internal";
import type { Transaction } from "/@/api/schema/internal";
import { EntityCard } from "/@/components/EntityCard";
import ErrorBoundary from "/@/components/ErrorBoundary";
import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
import { TransactionList } from "/@/components/TransactionList";
import BalanceChart from "/@/components/ranking/BalanceChart";
import { createExternalLinkHander } from "/@/lib/link";
import { type Copia, type ProjectName, type UserName, toBranded } from "/@/types/entity";
import type { Url } from "/@/types/entity";

const ProjectHeader = ({
    name,
    balance,
    isAdmin,
    url,
}: {
    name: ProjectName;
    balance: Copia;
    isAdmin: boolean;
    url?: Url;
}) => {
    const handleExternalLinkClick = url ? createExternalLinkHander(url) : undefined;

    return (
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
                        type="project"
                    />
                    <Flex
                        direction="row"
                        align="center"
                        gap="xs"
                    >
                        <Text
                            size="xl"
                            fw={700}
                        >
                            {name}
                        </Text>
                        {url && (
                            <ActionIcon
                                aria-label="サイトを開く"
                                color="gray"
                                onClick={handleExternalLinkClick}
                                size="lg"
                                variant="subtle"
                            >
                                <IconExternalLink size={20} />
                            </ActionIcon>
                        )}
                    </Flex>
                    {isAdmin && (
                        <Button
                            variant="light"
                            size="sm"
                        >
                            プロジェクトを管理
                        </Button>
                    )}
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
    );
};

const ProjectDetail = ({ transactions }: { transactions: Transaction[] }) => {
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
                        currentType="project"
                    />
                </div>
            </Card>
        </Flex>
    );
};

const ProjectMemberList = ({ owner, admins }: { owner?: User; admins?: User[] }) => {
    const members = [...(owner ? [owner] : []), ...(admins ?? [])].filter(Boolean);

    return (
        <>
            <Title
                order={2}
                fw={400}
            >
                メンバー
            </Title>

            <SimpleGrid
                cols={{ base: 1, md: 2, xl: 3 }}
                spacing="md"
            >
                {members.map(u => (
                    <EntityCard
                        key={u.id}
                        p="xl"
                        withBorder
                        radius="md"
                        type="user"
                        amount={toBranded<Copia>(BigInt(u.balance))}
                        name={toBranded<UserName>(u.name)}
                    />
                ))}
            </SimpleGrid>
        </>
    );
};

const TheProjectDetails = ({
    fetcher,
}: {
    fetcher: Promise<{ project: Project; transactions: Transaction[]; currentUserId: string }>;
}) => {
    const { project, transactions, currentUserId } = use(fetcher);

    const name = toBranded<ProjectName>(project.name);
    const balance = toBranded<Copia>(BigInt(project.balance));
    const url = project.url ? toBranded<Url>(project.url) : undefined;

    // 管理者判定
    const isAdmin =
        project.owner?.id === currentUserId ||
        (project.admins ?? []).some(admin => admin.id === currentUserId);

    return (
        <Flex
            direction="column"
            gap="md"
        >
            <ProjectHeader
                name={name}
                balance={balance}
                isAdmin={isAdmin}
                url={url}
            />
            <Divider />
            <ProjectDetail transactions={transactions} />
            <Divider />
            <ProjectMemberList
                owner={project.owner}
                admins={project.admins}
            />
        </Flex>
    );
};

const ProjectDetails = () => {
    const { projectId: _projectName } = useParams();
    const projectName = toBranded<ProjectName>(_projectName ?? "");

    const fetch = async () => {
        try {
            const { data: project } = await apis.internal.projects.getProject(projectName);
            const { data: transactionsData } =
                await apis.internal.transactions.getProjectTransactions(projectName);
            const { data: currentUser } = await apis.internal.me.getCurrentUser();

            // transactions が undefined または items が undefined の場合に安全に処理
            const transactions = (transactionsData?.items ?? []).filter(Boolean);

            return {
                project,
                transactions,
                currentUserId: currentUser.id,
            };
        } catch (error) {
            console.error("Failed to fetch project details:", error);
            throw error;
        }
    };

    return (
        <>
            <ErrorBoundary>
                <div>
                    <h1>Project Details</h1>
                    <p>Project ID: {projectId}</p>
                </div>
            </ErrorBoundary>
            <Suspense
                fallback={
                    <Center h="50vh">
                        <Loader size="lg" />
                    </Center>
                }
            >
                <TheProjectDetails fetcher={fetch()} />
            </Suspense>
        </>
    );
};
export default ProjectDetails;
