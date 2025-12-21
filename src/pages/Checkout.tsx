import { Suspense, use, useCallback, useMemo, useState } from "react";
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
    Text,
    rem,
} from "@mantine/core";
import { IconAlertCircle, IconCheck, IconX } from "@tabler/icons-react";

import apis from "/@/api";
import type { Bill } from "/@/api/schema/internal";
import CopiaLogoSrc from "/@/assets/icons/copiaLogo.svg";
import ErrorBoundary from "/@/components/ErrorBoundary";
import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
import { type Copia, type ProjectName, type UserName, toBranded } from "/@/types/entity";

const fetchBill = async (billId: string): Promise<Bill> => {
    const { data } = await apis.internal.me.getBill(billId);
    return data;
};

const CheckoutContent = ({ fetcher, billId }: { fetcher: Promise<Bill>; billId: string }) => {
    const bill = use(fetcher);

    const [actionType, setActionType] = useState<"approve" | "decline" | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [completedAction, setCompletedAction] = useState<"approve" | "decline" | null>(null);
    const [resultMessage, setResultMessage] = useState<string | null>(null);

    const isCompleted = bill.status !== "PENDING";

    const handleApprove = useCallback(async () => {
        setActionType("approve");
        setIsProcessing(true);
        try {
            const { data } = await apis.internal.me.approveBill(billId);
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
            await apis.internal.me.declineBill(billId);
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
                <img
                    src={CopiaLogoSrc}
                    alt="Copia Logo"
                    style={{ width: rem(32), height: rem(32) }}
                />
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
                    value={toBranded<Copia>(BigInt(bill.amount))}
                    size="custom"
                    customSize={5}
                    leadingIcon
                    trailingDash
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
            {isCompleted && (
                <Center mt="xl">
                    <Alert
                        color="yellow"
                        title="処理済み"
                        icon={<IconAlertCircle />}
                    >
                        この請求は既に処理されています（ステータス: {bill.status}）
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

export default function Checkout() {
    const [searchParams] = useSearchParams();
    const billId = searchParams.get("id");

    const fetcher = useMemo(() => {
        if (!billId) return Promise.reject(new Error("billId is required"));
        return fetchBill(billId);
    }, [billId]);

    if (!billId) {
        return (
            <Container className="relative h-screen overflow-hidden">
                <Center h="100%">
                    <Alert
                        color="red"
                        title="エラー"
                    >
                        請求IDが指定されていません。
                    </Alert>
                </Center>
            </Container>
        );
    }

    return (
        <ErrorBoundary>
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
        </ErrorBoundary>
    );
}
