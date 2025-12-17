/**
 * モックデータ定義
 * Internal API と Public API で使用するサンプルデータ
 */

import type { components as InternalComponents } from "../api/schema/internal";
import type { components as PublicComponents } from "../api/schema/public";

// Internal API の型
type User = InternalComponents["schemas"]["User"];
type Project = InternalComponents["schemas"]["Project"];
type Transaction = InternalComponents["schemas"]["Transaction"];
type Bill = InternalComponents["schemas"]["Bill"];
type APIClient = InternalComponents["schemas"]["APIClient"];

// Public API の型
type PublicProject = PublicComponents["schemas"]["Project"];
type PublicTransaction = PublicComponents["schemas"]["Transaction"];
type PublicBill = PublicComponents["schemas"]["Bill"];

// ========== ユーザーデータ ==========
export const mockUsers: User[] = [
    {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "alice",
        balance: 15000,
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440002",
        name: "bob",
        balance: 8500,
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440003",
        name: "charlie",
        balance: 23000,
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440004",
        name: "diana",
        balance: 12000,
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440005",
        name: "eve",
        balance: 5000,
    },
];

// 現在のユーザー（ログインユーザー）
export const mockCurrentUser: User = mockUsers[0]!;

// ========== プロジェクトデータ ==========
export const mockProjects: Project[] = [
    {
        id: "660e8400-e29b-41d4-a716-446655440001",
        name: "traP Portal",
        owner_id: mockCurrentUser.id,
        admin_ids: [mockUsers[1]!.id!, mockUsers[2]!.id!],
        balance: 50000,
    },
    {
        id: "660e8400-e29b-41d4-a716-446655440002",
        name: "NeoShowcase",
        owner_id: mockUsers[1]!.id,
        admin_ids: [mockCurrentUser.id!],
        balance: 30000,
    },
    {
        id: "660e8400-e29b-41d4-a716-446655440003",
        name: "traQ",
        owner_id: mockUsers[2]!.id,
        admin_ids: [],
        balance: 100000,
    },
];

// 現在のユーザーが管理者またはオーナーのプロジェクト
export const mockMyProjects: Project[] = mockProjects.filter(
    (p) =>
        p.owner_id === mockCurrentUser.id ||
        p.admin_ids?.includes(mockCurrentUser.id!),
);

// ========== 取引データ ==========
export const mockTransactions: Transaction[] = [
    {
        id: "770e8400-e29b-41d4-a716-446655440001",
        type: "TRANSFER",
        amount: 1000,
        project_id: mockProjects[0]!.id,
        user_id: mockCurrentUser.id,
        description: "バグ報告報酬",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2時間前
    },
    {
        id: "770e8400-e29b-41d4-a716-446655440002",
        type: "BILL_PAYMENT",
        amount: 500,
        project_id: mockProjects[1]!.id,
        user_id: mockCurrentUser.id,
        description: "サービス利用料",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1日前
    },
    {
        id: "770e8400-e29b-41d4-a716-446655440003",
        type: "TRANSFER",
        amount: 2500,
        project_id: mockProjects[2]!.id,
        user_id: mockCurrentUser.id,
        description: "コントリビューション報酬",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3日前
    },
];

// ========== 請求データ ==========
export const mockBills: Bill[] = [
    {
        id: "880e8400-e29b-41d4-a716-446655440001",
        amount: 800,
        user_id: mockCurrentUser.id,
        description: "イベント参加費",
        project_id: mockProjects[0]!.id,
        status: "PENDING",
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分前
    },
    {
        id: "880e8400-e29b-41d4-a716-446655440002",
        amount: 1200,
        user_id: mockCurrentUser.id,
        description: "プレミアム機能利用料",
        project_id: mockProjects[1]!.id,
        status: "COMPLETED",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2日前
    },
];

// ========== APIクライアントデータ ==========
export const mockAPIClients: APIClient[] = [
    {
        client_id: "client_001",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30日前
    },
    {
        client_id: "client_002",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7日前
    },
];

// ========== Public API用データ ==========
export const mockPublicProject: PublicProject = {
    id: mockProjects[0]!.id,
    name: mockProjects[0]!.name,
    balance: mockProjects[0]!.balance,
};

export const mockPublicTransactions: PublicTransaction[] = mockTransactions
    .filter((t) => t.project_id === mockProjects[0]!.id)
    .map((t) => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        user_id: t.user_id,
        user_name: mockUsers.find((u) => u.id === t.user_id)?.name,
        project_id: t.project_id,
        description: t.description,
        created_at: t.created_at,
    }));

export const mockPublicBills: PublicBill[] = mockBills.map((b) => ({
    id: b.id,
    amount: b.amount,
    user_id: b.user_id,
    user_name: mockUsers.find((u) => u.id === b.user_id)?.name,
    description: b.description,
    status: b.status,
    created_at: b.created_at,
}));

// ========== ユーティリティ ==========
export function generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        },
    );
}

export function getUserByName(name: string): User | undefined {
    return mockUsers.find((u) => u.name === name);
}

export function getBillById(id: string): Bill | undefined {
    return mockBills.find((b) => b.id === id);
}

export function getProjectById(id: string): Project | undefined {
    return mockProjects.find((p) => p.id === id);
}
