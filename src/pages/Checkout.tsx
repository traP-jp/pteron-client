import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button, Center, Container, Flex, Grid, Group, Text, rem } from "@mantine/core";

import CopiaLogoSrc from "/@/assets/icons/copiaLogo.svg";
import ErrorBoundary from "/@/components/ErrorBoundary";
import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
import { type Copia, type ProjectName, type UserName, toBranded } from "/@/types/entity";

export default function Checkout() {
    return (
        <ErrorBoundary>
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
                                name={toBranded<UserName>("o_o")}
                            ></PAvatar>
                            <Text
                                size="xl"
                                fw={600}
                                className="text-wrap break-all"
                            >
                                o_o
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
                                name={toBranded<ProjectName>("quarantineeeeeeeeee")}
                            ></PAvatar>
                            <Text
                                size="xl"
                                fw={600}
                                className="text-wrap break-all"
                            >
                                quarantineeeeeeeeeequarantineeeeeeeeeequarantineeeeeeeeee
                            </Text>
                        </Flex>
                    </Grid.Col>
                </Grid>
                <Center mt="xl">
                    <PAmount
                        value={toBranded<Copia>(100000000n)}
                        size="custom"
                        customSize={5}
                        leadingIcon
                        trailingDash
                    />
                </Center>
                <Group
                    justify="center"
                    grow
                    gap="xl"
                    className="absolute bottom-12 left-0 right-0 w-full px-12"
                >
                    <Button size="xl">拒否する</Button>
                    <Button size="xl">送金する</Button>
                </Group>
            </Container>
        </ErrorBoundary>
    );
}
