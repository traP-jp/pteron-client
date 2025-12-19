import type { Project, User } from "/@/api/schema/internal";

// User と Project を再エクスポート
export type { Project, User };

/**
 * ランキングアイテムのエンティティ型 (User または Project)
 */
export type RankingEntity = User | Project;

/**
 * 順位付きエンティティ情報
 */
export interface RankedItem<T extends RankingEntity = RankingEntity> {
    rank: number;
    rankDiff?: number;
    entity: T;
}

/**
 * 順位付きユーザー情報 (後方互換性のため)
 */
export type RankedUser = RankedItem<User>;

/**
 * 順位付きプロジェクト情報
 */
export type RankedProject = RankedItem<Project>;

/**
 * ランキングの種類
 */
export type RankingType = "user" | "project";

/**
 * ランキングコンポーネント共通のprops
 */
export interface RankingBaseProps<T extends RankingEntity = RankingEntity> {
    /** ランキングの種類 */
    type: RankingType;
    /** 表示するエンティティリスト */
    items: RankedItem<T>[];
    /** クリック時のコールバック */
    onItemClick?: (item: RankedItem<T>) => void;
}

/**
 * Project型かどうかを判定
 */
export function isProject(entity: RankingEntity): entity is Project {
    return "url" in entity || "owner_id" in entity || "admin_ids" in entity;
}
