import { Stack, Title } from "@mantine/core";

export const Home = () => {
    return (
        <Stack
            gap="xl"
            p="md"
        >
            <Title order={1}>Home</Title>
            {/* 本来のHomeページ内容をここに実装 */}
        </Stack>
    );
};

export default Home;
