/**
 * モックデータ定義
 * Internal API と Public API で使用するサンプルデータ
 */
import type { APIClient, Bill, Project, Transaction, User } from "../api/schema/internal";
import type {
    Bill as PublicBill,
    Project as PublicProject,
    Transaction as PublicTransaction,
} from "../api/schema/public";

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
        url: "https://portal.trap.jp",
        owner: mockUsers[0]!,
        admins: [mockUsers[1]!, mockUsers[2]!],
        balance: 50000,
    },
    {
        id: "660e8400-e29b-41d4-a716-446655440002",
        name: "NeoShowcase",
        url: "https://ns.trap.jp",
        owner: mockUsers[1]!,
        admins: [mockUsers[0]!],
        balance: 30000,
    },
    {
        id: "660e8400-e29b-41d4-a716-446655440003",
        name: "traQ",
        url: "https://q.trap.jp",
        owner: mockUsers[2]!,
        admins: [],
        balance: 100000,
    },
];

// 現在のユーザーが管理者またはオーナーのプロジェクト
export const mockMyProjects: Project[] = mockProjects.filter(
    p => p.owner?.id === mockCurrentUser.id || p.admins?.some(a => a.id === mockCurrentUser.id)
);

// ========== 取引データ ==========
export const mockTransactions: Transaction[] = [
    {
        id: "770e8400-e29b-41d4-a716-446655440001",
        type: "TRANSFER",
        amount: 1000,
        project: mockProjects[0]!,
        user: mockCurrentUser,
        description: "バグ報告報酬",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2時間前
    },
    {
        id: "770e8400-e29b-41d4-a716-446655440002",
        type: "BILL_PAYMENT",
        amount: 500,
        project: mockProjects[1]!,
        user: mockCurrentUser,
        description: "サービス利用料",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1日前
    },
    {
        id: "770e8400-e29b-41d4-a716-446655440003",
        type: "TRANSFER",
        amount: 2500,
        project: mockProjects[2]!,
        user: mockCurrentUser,
        description: "コントリビューション報酬",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3日前
    },
];

// ========== 請求データ ==========
export const mockBills: Bill[] = [
    {
        id: "880e8400-e29b-41d4-a716-446655440001",
        amount: 800,
        user: mockCurrentUser,
        description: "イベント参加費",
        project: mockProjects[0]!,
        status: "PENDING",
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分前
    },
    {
        id: "880e8400-e29b-41d4-a716-446655440002",
        amount: 1200,
        user: mockCurrentUser,
        description: "プレミアム機能利用料",
        project: mockProjects[1]!,
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
    .filter(t => t.project?.id === mockProjects[0]!.id)
    .map(t => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        user_id: t.user?.id,
        user_name: t.user?.name,
        project_id: t.project?.id,
        description: t.description,
        created_at: t.created_at,
    }));

export const mockPublicBills: PublicBill[] = mockBills.map(b => ({
    id: b.id,
    amount: b.amount,
    user_id: b.user?.id,
    user_name: b.user?.name,
    description: b.description,
    status: b.status,
    created_at: b.created_at,
}));

// ========== ユーティリティ ==========
export function generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function getUserById(id: string): User | undefined {
    return mockUsers.find(u => u.id === id);
}

export function getUserByName(name: string): User | undefined {
    return mockUsers.find(u => u.name === name);
}

export function getBillById(id: string): Bill | undefined {
    return mockBills.find(b => b.id === id);
}

export function getProjectById(id: string): Project | undefined {
    return mockProjects.find(p => p.id === id);
}
