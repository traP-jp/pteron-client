import React, { Suspense, use, useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Center,
    Container,
    Flex,
    Group,
    Stack,
    Text,
    UnstyledButton,
    rem,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowDown, IconArrowRight, IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";

import { Api, type Bill, type User } from "/@/api/schema/internal";
import CopiaLogoSrc from "/@/assets/icons/copiaLogo.svg";
import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
import { CheckoutPageSkeleton } from "/@/components/skeletons/PageSkeletons";
import { type Copia, type ProjectName, type UserName, toBranded } from "/@/types/entity";

// エラーハンドラーをバイパスするために直接axiosを使用
const checkoutApiClient = new Api();

type CheckoutData = {
    bill: Bill;
    currentUser: User;
};

const fetchCheckoutData = async (billId: string): Promise<CheckoutData> => {
    const [billResponse, userResponse] = await Promise.all([
        checkoutApiClient.me.getBill(billId),
        checkoutApiClient.me.getCurrentUser(),
    ]);
    return {
        bill: billResponse.data,
        currentUser: userResponse.data,
    };
};

const approveBill = async (billId: string): Promise<{ redirectUrl: string }> => {
    const { data } = await checkoutApiClient.me.approveBill(billId);
    return data;
};

const declineBill = async (billId: string) => {
    const { data } = await checkoutApiClient.me.declineBill(billId);
    return data;
};

const CopiaLogo = ({ clickable = false }: { clickable?: boolean }) => {
    const logo = (
        <img
            src={CopiaLogoSrc}
            alt="Copia Logo"
            style={{
                width: rem(32),
                height: rem(32),
                filter: "var(--logo-filter)",
            }}
        />
    );

    if (clickable) {
        return (
            <UnstyledButton
                onClick={() => {
                    window.location.href = "/";
                }}
            >
                {logo}
            </UnstyledButton>
        );
    }

    return logo;
};

const CheckoutContent = ({
    fetcher,
    billId,
}: {
    fetcher: Promise<CheckoutData>;
    billId: string;
}) => {
    const { bill, currentUser } = use(fetcher);

    const [actionType, setActionType] = useState<"approve" | "decline" | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [completedAction, setCompletedAction] = useState<"approve" | "decline" | null>(null);
    const [resultMessage, setResultMessage] = useState<string | null>(null);

    // モバイル判定（xs: 576px未満）
    const isMobile = useMediaQuery("(max-width: 576px)");

    const isCompleted = bill.status !== "PENDING";

    const currentBalance = BigInt(currentUser.balance);
    const billAmount = BigInt(bill.amount);
    const balanceAfterPayment = currentBalance - billAmount;

    const getCompletedMessage = () => {
        switch (bill.status) {
            case "COMPLETED":
                return "この請求は既に支払い済みです。";
            case "REJECTED":
                return "この請求は既に拒否されています。";
            case "FAILED":
                return "この請求の処理に失敗しました。";
            default:
                return "この請求は既に処理されています。";
        }
    };

    const handleApprove = useCallback(async () => {
        setActionType("approve");
        setIsProcessing(true);
        try {
            const data = await approveBill(billId);
            setResultMessage("支払いが完了しました。リダイレクトしています...");
            setIsProcessing(false);
            setCompletedAction("approve");
            setTimeout(() => {
                window.location.href = data.redirectUrl ?? "/";
            }, 750);
        } catch {
            setResultMessage("支払いに失敗しました。");
            setActionType(null);
            setIsProcessing(false);
        }
    }, [billId]);

    const handleDecline = useCallback(async () => {
        setActionType("decline");
        setIsProcessing(true);
        try {
            const data = await declineBill(billId);
            setResultMessage("請求を拒否しました。リダイレクトしています...");
            setIsProcessing(false);
            setCompletedAction("decline");
            setTimeout(() => {
                window.location.href = data.redirectUrl ?? "/";
            }, 750);
        } catch {
            setResultMessage("拒否に失敗しました。");
            setActionType(null);
            setIsProcessing(false);
        }
    }, [billId]);

    // ユーザー/プロジェクト表示コンポーネント
    const EntityDisplay = ({ type, name }: { type: "user" | "project"; name: string }) => (
        <Flex
            gap={{ base: "xs", sm: "lg" }}
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
            py="md"
        >
            <PAvatar
                size={isMobile ? "lg" : "checkout"}
                type={type}
                name={type === "user" ? toBranded<UserName>(name) : toBranded<ProjectName>(name)}
            />
            <Text
                size={isMobile ? "md" : "xl"}
                fw={600}
                className="text-wrap break-all"
                ta="center"
                maw="100%"
                px="xs"
            >
                {name}
            </Text>
        </Flex>
    );

    // 矢印アイコン
    const ArrowIcon = () => (
        <Center p={isMobile ? "xs" : "md"}>
            {isMobile ? (
                <IconArrowDown
                    size={32}
                    stroke={1.5}
                    color="gray"
                />
            ) : (
                <IconArrowRight
                    size={48}
                    stroke={1.5}
                    color="gray"
                />
            )}
        </Center>
    );

    return (
        <Container
            className="h-screen overflow-auto"
            px="md"
        >
            <Stack
                h="100%"
                justify="space-between"
                pb="md"
            >
                {/* 上部コンテンツ */}
                <Box>
                    <Center mt="md">
                        <CopiaLogo />
                    </Center>

                    {/* ユーザー → 矢印 → プロジェクト */}
                    {isMobile ? (
                        // モバイル: 縦並び
                        <Stack
                            align="center"
                            mt="xl"
                            gap={0}
                        >
                            <EntityDisplay
                                type="user"
                                name={bill.user.name}
                            />
                            <ArrowIcon />
                            <EntityDisplay
                                type="project"
                                name={bill.project.name}
                            />
                        </Stack>
                    ) : (
                        // デスクトップ: 横並び（中央揃え）
                        <Group
                            justify="center"
                            align="center"
                            mt="xl"
                            gap="md"
                            wrap="nowrap"
                        >
                            <Box
                                flex={1}
                                maw={200}
                            >
                                <EntityDisplay
                                    type="user"
                                    name={bill.user.name}
                                />
                            </Box>
                            <ArrowIcon />
                            <Box
                                flex={1}
                                maw={200}
                            >
                                <EntityDisplay
                                    type="project"
                                    name={bill.project.name}
                                />
                            </Box>
                        </Group>
                    )}

                    {/* 請求金額 */}
                    <Center mt="xl">
                        <PAmount
                            value={toBranded<Copia>(billAmount)}
                            size="custom"
                            customSize={isMobile ? 3 : 5}
                            leadingIcon
                            trailingDash
                            compact
                        />
                    </Center>

                    {bill.description && (
                        <Center mt="md">
                            <Text
                                size="sm"
                                c="dimmed"
                                ta="center"
                                px="md"
                            >
                                {bill.description}
                            </Text>
                        </Center>
                    )}

                    {/* 残高情報 - PENDINGの場合のみ表示 */}
                    {!isCompleted && (
                        <Center mt="lg">
                            <Stack
                                gap="xs"
                                align="stretch"
                            >
                                <Flex
                                    gap="xs"
                                    align="center"
                                    wrap="wrap"
                                    justify="center"
                                >
                                    <Text
                                        size="sm"
                                        c="dimmed"
                                        style={{ minWidth: 100, textAlign: "right" }}
                                    >
                                        現在の残高
                                    </Text>
                                    <Text
                                        size="sm"
                                        c="dimmed"
                                    >
                                        :
                                    </Text>
                                    <PAmount
                                        value={toBranded<Copia>(currentBalance)}
                                        size="sm"
                                        leadingIcon
                                        compact
                                    />
                                </Flex>
                                <Flex
                                    gap="xs"
                                    align="center"
                                    wrap="wrap"
                                    justify="center"
                                >
                                    <Text
                                        size="sm"
                                        c="dimmed"
                                        style={{ minWidth: 100, textAlign: "right" }}
                                    >
                                        支払い後の残高
                                    </Text>
                                    <Text
                                        size="sm"
                                        c="dimmed"
                                    >
                                        :
                                    </Text>
                                    <PAmount
                                        value={toBranded<Copia>(balanceAfterPayment)}
                                        size="sm"
                                        leadingIcon
                                        compact
                                    />
                                </Flex>
                            </Stack>
                        </Center>
                    )}

                    {isCompleted && (
                        <Center
                            mt="xl"
                            px="md"
                        >
                            <Alert
                                color="red"
                                title="処理できません"
                                icon={<IconX />}
                                w="100%"
                                maw={400}
                            >
                                {getCompletedMessage()}
                            </Alert>
                        </Center>
                    )}

                    {resultMessage && (
                        <Center
                            mt="xl"
                            px="md"
                        >
                            <Alert
                                color={resultMessage.includes("失敗") ? "red" : "green"}
                                icon={resultMessage.includes("失敗") ? <IconX /> : <IconCheck />}
                                w="100%"
                                maw={400}
                            >
                                {resultMessage}
                            </Alert>
                        </Center>
                    )}
                </Box>

                {/* ボタン - 常に下部に配置 */}
                <Stack
                    gap="md"
                    px={isMobile ? "md" : "xl"}
                >
                    {isMobile ? (
                        // モバイル: 縦並び、フル幅
                        <>
                            <Button
                                size="lg"
                                fullWidth
                                disabled={isCompleted || isProcessing || completedAction !== null}
                                loading={actionType === "approve" && isProcessing}
                                onClick={handleApprove}
                            >
                                {completedAction === "approve" ? (
                                    <IconCheck size={24} />
                                ) : (
                                    "送金する"
                                )}
                            </Button>
                            <Button
                                size="lg"
                                fullWidth
                                variant="outline"
                                styles={{ root: { borderWidth: 2 } }}
                                disabled={isCompleted || isProcessing || completedAction !== null}
                                loading={actionType === "decline" && isProcessing}
                                onClick={handleDecline}
                            >
                                {completedAction === "decline" ? (
                                    <IconCheck size={24} />
                                ) : (
                                    "拒否する"
                                )}
                            </Button>
                        </>
                    ) : (
                        // デスクトップ: 横並び
                        <Group
                            justify="center"
                            grow
                            gap="xl"
                            maw={600}
                            mx="auto"
                            w="100%"
                        >
                            <Button
                                size="xl"
                                variant="outline"
                                styles={{ root: { borderWidth: 2 } }}
                                disabled={isCompleted || isProcessing || completedAction !== null}
                                loading={actionType === "decline" && isProcessing}
                                onClick={handleDecline}
                            >
                                {completedAction === "decline" ? (
                                    <IconCheck size={24} />
                                ) : (
                                    "拒否する"
                                )}
                            </Button>
                            <Button
                                size="xl"
                                disabled={isCompleted || isProcessing || completedAction !== null}
                                loading={actionType === "approve" && isProcessing}
                                onClick={handleApprove}
                            >
                                {completedAction === "approve" ? (
                                    <IconCheck size={24} />
                                ) : (
                                    "送金する"
                                )}
                            </Button>
                        </Group>
                    )}
                </Stack>
            </Stack>
        </Container>
    );
};

const CheckoutError = ({ error }: { error: unknown }) => {
    let message = "請求の取得中にエラーが発生しました。";

    if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
            message = "指定された請求が見つかりません。URLを確認してください。";
        } else if (error.response?.status === 401 || error.response?.status === 403) {
            message = "この請求にアクセスする権限がありません。";
        }
    }

    return (
        <Container className="relative h-screen overflow-hidden">
            <Center mt="md">
                <CopiaLogo clickable />
            </Center>
            <Center h="80%">
                <Alert
                    color="red"
                    title="エラー"
                    icon={<IconX />}
                >
                    {message}
                </Alert>
            </Center>
        </Container>
    );
};

class CheckoutErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { error: unknown | null }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error: unknown) {
        return { error };
    }

    render() {
        if (this.state.error) {
            return <CheckoutError error={this.state.error} />;
        }
        return this.props.children;
    }
}

export default function Checkout() {
    const [searchParams] = useSearchParams();
    const billId = searchParams.get("id");

    const fetcher = useMemo(() => {
        if (!billId) return Promise.reject(new Error("billId is required"));
        return fetchCheckoutData(billId);
    }, [billId]);

    if (!billId) {
        return (
            <Container className="relative h-screen overflow-hidden">
                <Center mt="md">
                    <CopiaLogo clickable />
                </Center>
                <Center h="80%">
                    <Alert
                        color="red"
                        title="エラー"
                        icon={<IconX />}
                    >
                        請求IDが指定されていません。
                    </Alert>
                </Center>
            </Container>
        );
    }

    return (
        <CheckoutErrorBoundary>
            <Suspense fallback={<CheckoutPageSkeleton />}>
                <CheckoutContent
                    fetcher={fetcher}
                    billId={billId}
                />
            </Suspense>
        </CheckoutErrorBoundary>
    );
}
