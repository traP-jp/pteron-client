import type { components } from "/@/api/schema/internal";

/**
 * API から取得したユーザー情報
 */
export type User = components["schemas"]["User"];

/**
 * 順位付きユーザー情報
 */
export interface RankedUser {
    rank: number;
    rankDiff?: number;
    user: User;
}

/**
 * ランキングコンポーネント共通のprops
 */
export interface RankingBaseProps {
    /** 表示するユーザーリスト */
    users: RankedUser[];
    /** クリック時のコールバック */
    onUserClick?: (user: RankedUser) => void;
}
