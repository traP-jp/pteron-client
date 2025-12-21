import React, { Suspense, use, useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
    Alert,
    Button,
    Center,
    Container,
    Flex,
    Grid,
    Group,
    Loader,
    Stack,
    Text,
    UnstyledButton,
    rem,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";

import type { Bill, User } from "/@/api/schema/internal";
import CopiaLogoSrc from "/@/assets/icons/copiaLogo.svg";
import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
import { type Copia, type ProjectName, type UserName, toBranded } from "/@/types/entity";

// エラーハンドラーをバイパスするために直接axiosを使用
const checkoutApiClient = axios.create({
    baseURL: "/api/internal",
    headers: {
        "Content-Type": "application/json",
    },
});

type CheckoutData = {
    bill: Bill;
    currentUser: User;
};

const fetchCheckoutData = async (billId: string): Promise<CheckoutData> => {
    const [billResponse, userResponse] = await Promise.all([
        checkoutApiClient.get<Bill>(`/me/bills/${billId}`),
        checkoutApiClient.get<User>("/me"),
    ]);
    return {
        bill: billResponse.data,
        currentUser: userResponse.data,
    };
};

const approveBill = async (billId: string): Promise<{ redirectUrl: string }> => {
    const { data } = await checkoutApiClient.post<{ redirectUrl: string }>(
        `/me/bills/${billId}/approve`
    );
    return data;
};

const declineBill = async (billId: string): Promise<void> => {
    await checkoutApiClient.post(`/me/bills/${billId}/decline`);
};

const CopiaLogo = ({ clickable = false }: { clickable?: boolean }) => {
    const logo = (
        <img
            src={CopiaLogoSrc}
            alt="Copia Logo"
            style={{ width: rem(32), height: rem(32) }}
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
            await declineBill(billId);
            setResultMessage("請求を拒否しました。リダイレクトしています...");
            setIsProcessing(false);
            setCompletedAction("decline");
            setTimeout(() => {
                window.location.href = bill.project.url ?? "/";
            }, 750);
        } catch {
            setResultMessage("拒否に失敗しました。");
            setActionType(null);
            setIsProcessing(false);
        }
    }, [billId, bill.project.url]);

    return (
        <Container className="relative h-screen overflow-hidden">
            <Center mt="md">
                <CopiaLogo />
            </Center>
            <Grid
                gutter="md"
                align="center"
                justify="center"
                mt="xl"
            >
                <Grid.Col
                    span={4}
                    className="mb-auto"
                >
                    <Flex
                        mih={50}
                        bg="lime.2"
                        gap="lg"
                        justify="center"
                        align="center"
                        direction="column"
                        wrap="wrap"
                    >
                        <PAvatar
                            size="checkout"
                            type="user"
                            name={toBranded<UserName>(bill.user.name)}
                        ></PAvatar>
                        <Text
                            size="xl"
                            fw={600}
                            className="text-wrap break-all"
                        >
                            {bill.user.name}
                        </Text>
                    </Flex>
                </Grid.Col>
                <Grid.Col span={3}>
                    <DotLottieReact
                        className="rotate-90"
                        src="/@/assets/icons/Swipe_up_Arrows.lottie"
                        loop
                        autoplay
                        layout={{
                            fit: "fit-height",
                        }}
                    />
                </Grid.Col>
                <Grid.Col
                    span={4}
                    className="mb-auto"
                >
                    <Flex
                        mih={50}
                        bg="lime.2"
                        gap="lg"
                        justify="center"
                        align="center"
                        direction="column"
                        wrap="wrap"
                    >
                        <PAvatar
                            size="checkout"
                            type="project"
                            name={toBranded<ProjectName>(bill.project.name)}
                        ></PAvatar>
                        <Text
                            size="xl"
                            fw={600}
                            className="text-wrap break-all"
                        >
                            {bill.project.name}
                        </Text>
                    </Flex>
                </Grid.Col>
            </Grid>
            <Center mt="xl">
                <PAmount
                    value={toBranded<Copia>(billAmount)}
                    size="custom"
                    customSize={5}
                    leadingIcon
                    trailingDash
                    compact="safe"
                />
            </Center>
            {bill.description && (
                <Center mt="md">
                    <Text
                        size="sm"
                        c="dimmed"
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
                        >
                            <Text
                                size="sm"
                                c="dimmed"
                                style={{ width: 120, textAlign: "right" }}
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
                            />
                        </Flex>
                        <Flex
                            gap="xs"
                            align="center"
                        >
                            <Text
                                size="sm"
                                c="dimmed"
                                style={{ width: 120, textAlign: "right" }}
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
                            />
                        </Flex>
                    </Stack>
                </Center>
            )}
            {isCompleted && (
                <Center mt="xl">
                    <Alert
                        color="red"
                        title="処理できません"
                        icon={<IconX />}
                    >
                        {getCompletedMessage()}
                    </Alert>
                </Center>
            )}
            {resultMessage && (
                <Center mt="xl">
                    <Alert
                        color={resultMessage.includes("失敗") ? "red" : "green"}
                        icon={resultMessage.includes("失敗") ? <IconX /> : <IconCheck />}
                    >
                        {resultMessage}
                    </Alert>
                </Center>
            )}
            <Group
                justify="center"
                grow
                gap="xl"
                className="absolute bottom-12 left-0 right-0 w-full px-12"
            >
                <Button
                    size="xl"
                    disabled={isCompleted || isProcessing || completedAction !== null}
                    loading={actionType === "decline" && isProcessing}
                    onClick={handleDecline}
                    leftSection={
                        completedAction === "decline" ? <IconCheck size={24} /> : undefined
                    }
                >
                    {completedAction === "decline" ? "" : "拒否する"}
                </Button>
                <Button
                    size="xl"
                    disabled={isCompleted || isProcessing || completedAction !== null}
                    loading={actionType === "approve" && isProcessing}
                    onClick={handleApprove}
                    leftSection={
                        completedAction === "approve" ? <IconCheck size={24} /> : undefined
                    }
                >
                    {completedAction === "approve" ? "" : "送金する"}
                </Button>
            </Group>
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
            <Suspense
                fallback={
                    <Container className="relative h-screen overflow-hidden">
                        <Center h="100%">
                            <Loader size="xl" />
                        </Center>
                    </Container>
                }
            >
                <CheckoutContent
                    fetcher={fetcher}
                    billId={billId}
                />
            </Suspense>
        </CheckoutErrorBoundary>
    );
}
