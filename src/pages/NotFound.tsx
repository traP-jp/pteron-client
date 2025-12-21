import { memo } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Center, Stack, Text, Title, rem } from "@mantine/core";
import { IconHome, IconMoodSad } from "@tabler/icons-react";

function NotFound() {
    const navigate = useNavigate();

    return (
        <Center h="70vh">
            <Stack
                align="center"
                gap="lg"
            >
                <IconMoodSad
                    style={{ width: rem(80), height: rem(80) }}
                    stroke={1.5}
                    color="var(--mantine-color-dimmed)"
                />
                <Stack
                    align="center"
                    gap="xs"
                >
                    <Title
                        order={1}
                        c="dimmed"
                    >
                        404
                    </Title>
                    <Text
                        size="xl"
                        c="dimmed"
                    >
                        ページが見つかりません
                    </Text>
                </Stack>
                <Button
                    leftSection={<IconHome size={16} />}
                    variant="light"
                    onClick={() => navigate("/")}
                >
                    ホームに戻る
                </Button>
            </Stack>
        </Center>
    );
}

export default memo(NotFound);
