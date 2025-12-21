import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { Group, SegmentedControl, Select, Stack, Text, Title } from "@mantine/core";

import ErrorBoundary from "/@/components/ErrorBoundary";

type Period = "24hours" | "7days" | "30days" | "365days";

const periodOptions = [
    { value: "24hours", label: "24時間" },
    { value: "7days", label: "7日間" },
    { value: "30days", label: "30日間" },
    { value: "365days", label: "365日間" },
];

const Stats = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [period, setPeriod] = useState<Period>("7days");

    // 現在のタブを判定
    const currentTab = location.pathname.includes("/stats/projects") ? "projects" : "users";

    const handleTabChange = (value: string) => {
        navigate(`/stats/${value}`);
    };

    return (
        <ErrorBoundary>
            <Stack
                gap="lg"
                p="md"
            >
                <Group justify="space-between">
                    <Title order={2}>ランキング</Title>
                    <Group gap="md">
                        <Text
                            c="dimmed"
                            size="sm"
                        >
                            最終更新: {new Date().toLocaleString("ja-JP")}
                        </Text>
                        <Select
                            data={periodOptions}
                            onChange={v => v && setPeriod(v as Period)}
                            size="sm"
                            value={period}
                            w={120}
                        />
                    </Group>
                </Group>

                <SegmentedControl
                    data={[
                        { value: "users", label: "ユーザー" },
                        { value: "projects", label: "プロジェクト" },
                    ]}
                    onChange={handleTabChange}
                    value={currentTab}
                />

                <Outlet context={{ period }} />
            </Stack>
        </ErrorBoundary>
    );
};

export default Stats;
