/**
 * MSW ハンドラー定義
 * Internal API と Public API のモックエンドポイント
 */

import { http, HttpResponse } from "msw";

import {
    generateUUID,
    getBillById,
    getProjectById,
    getUserByName,
    mockAPIClients,
    mockBills,
    mockCurrentUser,
    mockMyProjects,
    mockProjects,
    mockPublicBills,
    mockPublicProject,
    mockPublicTransactions,
    mockTransactions,
    mockUsers,
} from "./data";

// ========== Internal API ハンドラー ==========
const internalHandlers = [
    // GET /api/internal/me - 自分の情報を取得
    http.get("/api/internal/me", () => {
        return HttpResponse.json(mockCurrentUser);
    }),

    // GET /api/internal/me/transactions - 自分の取引履歴を取得
    http.get("/api/internal/me/transactions", ({ request }) => {
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get("limit")) || 20;
        const cursor = url.searchParams.get("cursor");

        let startIndex = 0;
        if (cursor) {
            const cursorIndex = mockTransactions.findIndex(
                (t) => t.id === cursor,
            );
            if (cursorIndex !== -1) {
                startIndex = cursorIndex + 1;
            }
        }

        const items = mockTransactions.slice(startIndex, startIndex + limit);
        const nextCursor =
            startIndex + limit < mockTransactions.length
                ? mockTransactions[startIndex + limit]?.id
                : undefined;

        return HttpResponse.json({
            items,
            next_cursor: nextCursor,
        });
    }),

    // GET /api/internal/me/bills/:bill_id - 請求の詳細を取得
    http.get("/api/internal/me/bills/:bill_id", ({ params }) => {
        const bill = getBillById(params.bill_id as string);
        if (!bill) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(bill);
    }),

    // POST /api/internal/me/bills/:bill_id/approve - 請求を承認
    http.post("/api/internal/me/bills/:bill_id/approve", ({ params }) => {
        const bill = getBillById(params.bill_id as string);
        if (!bill) {
            return new HttpResponse(null, { status: 404 });
        }
        if (bill.status !== "PENDING") {
            return new HttpResponse(null, { status: 409 });
        }
        // モックなので状態を変更しないが、成功を返す
        return HttpResponse.json({
            redirect_url: "https://example.com/success",
        });
    }),

    // POST /api/internal/me/bills/:bill_id/decline - 請求を拒否
    http.post("/api/internal/me/bills/:bill_id/decline", ({ params }) => {
        const bill = getBillById(params.bill_id as string);
        if (!bill) {
            return new HttpResponse(null, { status: 404 });
        }
        if (bill.status !== "PENDING") {
            return new HttpResponse(null, { status: 409 });
        }
        return new HttpResponse(null, { status: 204 });
    }),

    // GET /api/internal/me/projects - 自分のプロジェクト一覧
    http.get("/api/internal/me/projects", () => {
        return HttpResponse.json(mockMyProjects);
    }),

    // GET /api/internal/users - 全ユーザー一覧
    http.get("/api/internal/users", ({ request }) => {
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get("limit")) || 20;
        const cursor = url.searchParams.get("cursor");

        let startIndex = 0;
        if (cursor) {
            const cursorIndex = mockUsers.findIndex((u) => u.id === cursor);
            if (cursorIndex !== -1) {
                startIndex = cursorIndex + 1;
            }
        }

        const items = mockUsers.slice(startIndex, startIndex + limit);
        const nextCursor =
            startIndex + limit < mockUsers.length
                ? mockUsers[startIndex + limit]?.id
                : undefined;

        return HttpResponse.json({
            items,
            next_cursor: nextCursor,
        });
    }),

    // GET /api/internal/leaderboard/:category - ランキング
    http.get("/api/internal/leaderboard/:category", ({ request }) => {
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get("limit")) || 20;

        // balance順でソート
        const sortedUsers = [...mockUsers].sort(
            (a, b) => (b.balance ?? 0) - (a.balance ?? 0),
        );
        const items = sortedUsers.slice(0, limit);

        return HttpResponse.json({
            items,
            next_cursor: undefined,
        });
    }),

    // GET /api/internal/projects - 全プロジェクト一覧
    http.get("/api/internal/projects", ({ request }) => {
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get("limit")) || 20;
        const cursor = url.searchParams.get("cursor");

        let startIndex = 0;
        if (cursor) {
            const cursorIndex = mockProjects.findIndex((p) => p.id === cursor);
            if (cursorIndex !== -1) {
                startIndex = cursorIndex + 1;
            }
        }

        const items = mockProjects.slice(startIndex, startIndex + limit);
        const nextCursor =
            startIndex + limit < mockProjects.length
                ? mockProjects[startIndex + limit]?.id
                : undefined;

        return HttpResponse.json({
            items,
            next_cursor: nextCursor,
        });
    }),

    // POST /api/internal/projects - プロジェクト新規作成
    http.post("/api/internal/projects", async ({ request }) => {
        const body = (await request.json()) as { name?: string };
        const newProject = {
            id: generateUUID(),
            name: body.name ?? "New Project",
            owner_id: mockCurrentUser.id,
            admin_ids: [],
            balance: 0,
        };
        return HttpResponse.json(newProject, { status: 201 });
    }),

    // GET /api/internal/projects/:project_id - プロジェクト詳細
    http.get("/api/internal/projects/:project_id", ({ params }) => {
        const project = getProjectById(params.project_id as string);
        if (!project) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(project);
    }),

    // GET /api/internal/projects/:project_id/admins - 管理者一覧
    http.get("/api/internal/projects/:project_id/admins", ({ params }) => {
        const project = getProjectById(params.project_id as string);
        if (!project) {
            return new HttpResponse(null, { status: 404 });
        }
        const admins = mockUsers.filter((u) =>
            project.admin_ids?.includes(u.id!),
        );
        return HttpResponse.json(admins);
    }),

    // POST /api/internal/projects/:project_id/admins - 管理者追加
    http.post("/api/internal/projects/:project_id/admins", ({ params }) => {
        const project = getProjectById(params.project_id as string);
        if (!project) {
            return new HttpResponse(null, { status: 404 });
        }
        return new HttpResponse(null, { status: 204 });
    }),

    // DELETE /api/internal/projects/:project_id/admins/:user_id - 管理者削除
    http.delete(
        "/api/internal/projects/:project_id/admins/:user_id",
        ({ params }) => {
            const project = getProjectById(params.project_id as string);
            if (!project) {
                return new HttpResponse(null, { status: 404 });
            }
            return new HttpResponse(null, { status: 204 });
        },
    ),

    // GET /api/internal/projects/:project_id/clients - APIクライアント一覧
    http.get("/api/internal/projects/:project_id/clients", ({ params }) => {
        const project = getProjectById(params.project_id as string);
        if (!project) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(mockAPIClients);
    }),

    // POST /api/internal/projects/:project_id/clients - APIクライアント発行
    http.post("/api/internal/projects/:project_id/clients", ({ params }) => {
        const project = getProjectById(params.project_id as string);
        if (!project) {
            return new HttpResponse(null, { status: 404 });
        }
        const newClient = {
            client_id: `client_${generateUUID().substring(0, 8)}`,
            client_secret: `secret_${generateUUID()}`, // 作成時のみ返却
            created_at: new Date().toISOString(),
        };
        return HttpResponse.json(newClient, { status: 201 });
    }),

    // DELETE /api/internal/projects/:project_id/clients/:client_id - APIクライアント削除
    http.delete(
        "/api/internal/projects/:project_id/clients/:client_id",
        ({ params }) => {
            const project = getProjectById(params.project_id as string);
            if (!project) {
                return new HttpResponse(null, { status: 404 });
            }
            return new HttpResponse(null, { status: 204 });
        },
    ),
];

// ========== Public API ハンドラー ==========
const publicHandlers = [
    // GET /api/v1/project - 自プロジェクト情報
    http.get("/api/v1/project", () => {
        return HttpResponse.json(mockPublicProject);
    }),

    // GET /api/v1/project/transactions - 取引履歴
    http.get("/api/v1/project/transactions", ({ request }) => {
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get("limit")) || 20;

        const items = mockPublicTransactions.slice(0, limit);
        return HttpResponse.json({
            items,
            next_cursor: undefined,
        });
    }),

    // POST /api/v1/transactions - ユーザーへ送金
    http.post("/api/v1/transactions", async ({ request }) => {
        const body = (await request.json()) as {
            to_user: string;
            amount: number;
            description?: string;
            request_id?: string;
        };

        const targetUser = getUserByName(body.to_user);
        if (!targetUser) {
            return new HttpResponse(null, { status: 400 });
        }

        const transaction = {
            id: body.request_id ?? generateUUID(),
            amount: body.amount,
            type: "TRANSFER" as const,
            user_id: targetUser.id,
            user_name: targetUser.name,
            project_id: mockPublicProject.id,
            description: body.description,
            created_at: new Date().toISOString(),
        };

        return HttpResponse.json(transaction);
    }),

    // POST /api/v1/bills - 請求作成
    http.post("/api/v1/bills", async ({ request }) => {
        const body = (await request.json()) as {
            target_user: string;
            amount: number;
            description?: string;
            success_url: string;
            cancel_url: string;
        };

        const targetUser = getUserByName(body.target_user);
        if (!targetUser) {
            return new HttpResponse(null, { status: 400 });
        }

        const billId = generateUUID();
        return HttpResponse.json(
            {
                bill_id: billId,
                payment_url: `http://localhost:5173/checkout/${billId}`,
                expires_at: new Date(
                    Date.now() + 1000 * 60 * 30,
                ).toISOString(), // 30分後
            },
            { status: 201 },
        );
    }),

    // GET /api/v1/bills/:bill_id - 請求ステータス
    http.get("/api/v1/bills/:bill_id", ({ params }) => {
        const bill = mockPublicBills.find((b) => b.id === params.bill_id);
        if (!bill) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(bill);
    }),
];

export const handlers = [...internalHandlers, ...publicHandlers];
