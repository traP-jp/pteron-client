import {
    ActionIcon,
    CopyButton,
    Flex,
    type FlexProps,
    PasswordInput,
    type PasswordInputProps,
    Tooltip,
} from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";

function CopyValue({ value }: { value: string }) {
    return (
        <CopyButton
            value={value}
            timeout={2000}
        >
            {({ copied, copy }) => (
                <Tooltip
                    label={copied ? "Copied" : "Copy"}
                    withArrow
                    position="right"
                >
                    <ActionIcon
                        color={copied ? "teal" : "gray"}
                        variant="subtle"
                        onClick={copy}
                    >
                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                    </ActionIcon>
                </Tooltip>
            )}
        </CopyButton>
    );
}

export default function SecretCopyInput(
    props: PasswordInputProps & FlexProps & { value: string; label?: string; description?: string }
) {
    return (
        <Flex
            direction="row"
            {...props}
            gap="xs"
            align="flex-end"
            className="flex-auto w-full"
        >
            <PasswordInput
                className="w-full"
                label={props.label}
                description={props.description}
                readOnly
                {...props}
            />
            {props.value && <CopyValue value={props.value} />}
        </Flex>
    );
}
