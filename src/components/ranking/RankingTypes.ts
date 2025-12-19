import type { User } from "/@/api/schema/internal";

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
