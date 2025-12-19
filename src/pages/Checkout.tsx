import { Button, Container, Flex, Grid } from "@mantine/core";

export function Checkout() {
    return (
        <Container>
            <Flex
                gap="xl"
                justify="center"
                align="center"
                direction="column"
                wrap="wrap"
            >
                <Grid
                // justify="center"
                // align="center"
                >
                    <Grid.Col span={3}>
                        <Flex
                            gap="xl"
                            justify="center"
                            align="center"
                            direction="column"
                            wrap="wrap"
                        ></Flex>
                    </Grid.Col>
                    <Grid.Col
                        span={3}
                        h={120}
                    >
                        2
                    </Grid.Col>
                    <Grid.Col
                        span={3}
                        h={100}
                    >
                        3
                    </Grid.Col>
                </Grid>
                <Button>Button 2</Button>
                <Button>Button 3</Button>
            </Flex>
        </Container>
    );
}
