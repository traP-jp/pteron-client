import {
    type ErrorBoundaryPropsWithComponent,
    type FallbackProps,
    ErrorBoundary as TheErrorBoundary,
} from "react-error-boundary";

import { Button, Card, Text } from "@mantine/core";

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <Card role="alert">
            <Text c="red">{error.message}</Text>
            <pre className="overflow-auto">{error.stack}</pre>
            <Button onClick={resetErrorBoundary}>Reset</Button>
        </Card>
    );
}

const ErrorBoundary = (props: Omit<ErrorBoundaryPropsWithComponent, "FallbackComponent">) => {
    return (
        <TheErrorBoundary
            FallbackComponent={Fallback}
            {...props}
        />
    );
};

export default ErrorBoundary;
