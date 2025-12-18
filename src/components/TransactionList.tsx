import { Accordion, Stack } from "@mantine/core";

import type { components } from "/@/api/schema/internal";

import { TransactionItem } from "./TransactionItem";

type Transaction = components["schemas"]["Transaction"];

export type TransactionListProps =
    | {
          transactions: Transaction[];
          /** 表示方向: "from" = From表示, "to" = To表示, "both" = 両方表示 */
          direction: "from" | "to" | "both";
          currentType?: "user" | "project";
      }
    | {
          transactions: Transaction[];
          /** 表示方向: "auto" = 自分以外のみを表示（デフォルト） */
          direction?: "auto";
          /** 自分のタイプ: "user" | "project" */
          currentType: "user" | "project";
      };

export const TransactionList = ({
    transactions,
    currentType,
    direction = "auto",
}: TransactionListProps) => {
    const getDirection = (transaction: Transaction): "from" | "to" | "both" => {
        if (direction !== "auto") {
            return direction as "from" | "to" | "both";
        }

        if (!currentType) {
            return "both";
        }

        if (transaction.type === "TRANSFER") {
            return currentType === "user" ? "from" : "to";
        } else {
            return currentType === "user" ? "to" : "from";
        }
    };

    return (
        <Stack gap="md">
            <Accordion radius="md">
                {transactions.map(transaction => (
                    <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        direction={getDirection(transaction)}
                    />
                ))}
            </Accordion>
        </Stack>
    );
};
