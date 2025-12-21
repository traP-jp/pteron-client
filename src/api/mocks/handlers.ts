/**
 * MSW ハンドラー定義
 * Internal API と Public API のモックエンドポイント
 */
import { HttpResponse, http } from "msw";

import {
    generateUUID,
    getBillById,
    getProjectByIdOrName,
    getProjectsByOwnerOrAdminIdOrName,
    getTransactionsByProjectIdOrName,
    getTransactionsByUserIdOrName,
    getUserByIdOrName,
    getUserByName,
    mockAPIClients,
    mockCurrentUser,
    mockProjects,
    mockPublicBills,
    mockPublicProject,
    mockPublicTransactions,
    mockTransactions,
    mockUsers,
} from "./data";

// ========== Internal API ハンドラー ==========
const internalHandlers = [
    // GET /internal/me - 自分の情報を取得
    http.get("/api/internal/me", () => {
        return HttpResponse.json(mockCurrentUser);
    }),

    // GET /internal/me/bills/:bill_id - 請求の詳細を取得
    http.get("/api/internal/me/bills/:bill_id", ({ params }) => {
        const bill = getBillById(params.bill_id as string);
        if (!bill) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(bill);
    }),

    // POST /internal/me/bills/:bill_id/approve - 請求を承認
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
            redirectUrl: bill.project?.url ?? "https://example.com/success",
        });
    }),

    // POST /internal/me/bills/:bill_id/decline - 請求を拒否
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

    // GET /internal/transactions - 経済圏全体の取引履歴
    http.get("/api/internal/transactions", ({ request }) => {
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get("limit")) || 20;
        const cursor = url.searchParams.get("cursor");

        let startIndex = 0;
        if (cursor) {
            const cursorIndex = mockTransactions.findIndex(t => t.id === cursor);
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

    // GET /internal/transactions/users/:user_id - ユーザーの取引履歴
    http.get("/api/internal/transactions/users/:user_id", ({ request, params }) => {
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get("limit")) || 20;
        const userId = params.user_id as string;

        const userTransactions = getTransactionsByUserIdOrName(userId);
        const items = userTransactions.slice(0, limit);

        return HttpResponse.json({
            items,
            next_cursor: undefined,
        });
    }),

    // GET /internal/transactions/projects/:project_id - プロジェクトの取引履歴
    http.get("/api/internal/transactions/projects/:project_id", ({ request, params }) => {
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get("limit")) || 20;
        const projectId = params.project_id as string;

        const projectTransactions = getTransactionsByProjectIdOrName(projectId);
        const items = projectTransactions.slice(0, limit);

        return HttpResponse.json({
            items,
            next_cursor: undefined,
        });
    }),

    // GET /internal/stats - 経済圏全体の統計情報
    http.get("/api/internal/stats", () => {
        const totalBalance =
            mockUsers.reduce((sum, u) => sum + (u.balance ?? 0), 0) +
            mockProjects.reduce((sum, p) => sum + (p.balance ?? 0), 0);
        return HttpResponse.json({
            balance: totalBalance,
            difference: 5000,
            count: mockTransactions.length,
            total: mockTransactions.reduce((sum, t) => sum + (t.amount ?? 0), 0),
            ratio: 5,
        });
    }),

    // GET /internal/stats/users - ユーザー関連統計
    http.get("/api/internal/stats/users", () => {
        const userBalance = mockUsers.reduce((sum, u) => sum + (u.balance ?? 0), 0);
        const userTransactions = mockTransactions.filter(t => t.type === "TRANSFER");
        return HttpResponse.json({
            number: mockUsers.length,
            balance: userBalance,
            difference: 3000,
            count: userTransactions.length,
            total: userTransactions.reduce((sum, t) => sum + (t.amount ?? 0), 0),
            ratio: 3,
        });
    }),

    // GET /internal/stats/projects - プロジェクト関連統計
    http.get("/api/internal/stats/projects", () => {
        const projectBalance = mockProjects.reduce((sum, p) => sum + (p.balance ?? 0), 0);
        return HttpResponse.json({
            number: mockProjects.length,
            balance: projectBalance,
            difference: 2000,
            count: mockTransactions.length,
            total: mockTransactions.reduce((sum, t) => sum + (t.amount ?? 0), 0),
            ratio: 2,
        });
    }),

    // GET /internal/stats/users/:ranking_name - ユーザーランキング
    http.get("/api/internal/stats/users/:ranking_name", ({ request }) => {
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get("limit")) || 20;
        const order = url.searchParams.get("order") || "desc";

        const sortedUsers = [...mockUsers].sort((a, b) => {
            const diff = (b.balance ?? 0) - (a.balance ?? 0);
            return order === "asc" ? -diff : diff;
        });

        const items = sortedUsers.slice(0, limit).map((user, index) => ({
            rank: index + 1,
            value: user.balance ?? 0,
            difference: Math.floor(Math.random() * 5) - 2, // ランダムな順位変動
            user,
        }));

        return HttpResponse.json({
            items,
            next_cursor: undefined,
        });
    }),

    // GET /internal/stats/projects/:project_name - プロジェクトランキング
    http.get("/api/internal/stats/projects/:project_name", ({ request }) => {
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get("limit")) || 20;
        const order = url.searchParams.get("order") || "desc";

        const sortedProjects = [...mockProjects].sort((a, b) => {
            const diff = (b.balance ?? 0) - (a.balance ?? 0);
            return order === "asc" ? -diff : diff;
        });

        const items = sortedProjects.slice(0, limit).map((project, index) => ({
            rank: index + 1,
            value: project.balance ?? 0,
            difference: Math.floor(Math.random() * 5) - 2,
            project,
        }));

        return HttpResponse.json({
            items,
            next_cursor: undefined,
        });
    }),

    // GET /internal/users - 全ユーザー一覧
    http.get("/api/internal/users", ({ request }) => {
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get("limit")) || 20;
        const cursor = url.searchParams.get("cursor");

        let startIndex = 0;
        if (cursor) {
            const cursorIndex = mockUsers.findIndex(u => u.id === cursor);
            if (cursorIndex !== -1) {
                startIndex = cursorIndex + 1;
            }
        }

        const items = mockUsers.slice(startIndex, startIndex + limit);
        const nextCursor =
            startIndex + limit < mockUsers.length ? mockUsers[startIndex + limit]?.id : undefined;

        return HttpResponse.json({
            items,
            next_cursor: nextCursor,
        });
    }),

    // GET /internal/users/:user_id - ユーザー詳細
    http.get("/api/internal/users/:user_id", ({ params }) => {
        const user = getUserByIdOrName(params.user_id as string);
        if (!user) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(user);
    }),

    // GET /internal/users/:user_id/balance - ユーザー残高
    http.get("/api/internal/users/:user_id/balance", ({ params }) => {
        const user = getUserByIdOrName(params.user_id as string);
        if (!user) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json({
            balance: user.balance ?? 0,
        });
    }),

    // GET /internal/users/:user_id/stats - ユーザーのランキング順位一覧
    http.get("/api/internal/users/:user_id/stats", ({ params }) => {
        const user = getUserByIdOrName(params.user_id as string);
        if (!user) {
            return new HttpResponse(null, { status: 404 });
        }

        const sortedUsers = [...mockUsers].sort((a, b) => (b.balance ?? 0) - (a.balance ?? 0));
        const rank = sortedUsers.findIndex(u => u.id === user.id) + 1;

        const statItem = {
            rank,
            value: user.balance ?? 0,
            difference: 0,
            user,
        };

        return HttpResponse.json({
            balance: statItem,
            difference: { ...statItem, value: 0 },
            in: { ...statItem, value: 1000 },
            out: { ...statItem, value: 500 },
            count: { ...statItem, value: 5 },
            total: { ...statItem, value: 1500 },
            ratio: { ...statItem, value: 10 },
        });
    }),

    // GET /internal/users/:user_id/projects - ユーザーのプロジェクト一覧
    http.get("/api/internal/users/:user_id/projects", ({ params }) => {
        const userId = params.user_id as string;
        const userProjects = getProjectsByOwnerOrAdminIdOrName(userId);
        return HttpResponse.json({
            items: userProjects,
            nextCursor: null,
        });
    }),

    // GET /internal/projects - 全プロジェクト一覧
    http.get("/api/internal/projects", ({ request }) => {
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get("limit")) || 20;
        const cursor = url.searchParams.get("cursor");

        let startIndex = 0;
        if (cursor) {
            const cursorIndex = mockProjects.findIndex(p => p.id === cursor);
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

    // POST /internal/projects - プロジェクト新規作成
    http.post("/api/internal/projects", async ({ request }) => {
        const body = (await request.json()) as { name?: string; url?: string };
        const newProject = {
            id: generateUUID(),
            name: body.name ?? "New Project",
            url: body.url ?? "https://example.com",
            owner: mockCurrentUser,
            admins: [],
            balance: 0,
        };
        return HttpResponse.json(newProject, { status: 201 });
    }),

    // GET /internal/projects/:project_id - プロジェクト詳細
    http.get("/api/internal/projects/:project_id", ({ params }) => {
        const project = getProjectByIdOrName(params.project_id as string);
        if (!project) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(project);
    }),

    // PUT /internal/projects/:project_id - プロジェクト更新
    http.put("/api/internal/projects/:project_id", async ({ params, request }) => {
        const project = getProjectByIdOrName(params.project_id as string);
        if (!project) {
            return new HttpResponse(null, { status: 404 });
        }
        const body = (await request.json()) as { url?: string };
        return HttpResponse.json(
            {
                ...project,
                url: body.url ?? project.url,
            },
            { status: 201 }
        );
    }),

    // GET /internal/projects/:project_id/balance - プロジェクト残高
    http.get("/api/internal/projects/:project_id/balance", ({ params }) => {
        const project = getProjectByIdOrName(params.project_id as string);
        if (!project) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json({
            balance: project.balance ?? 0,
        });
    }),

    // GET /internal/projects/:project_id/stats - プロジェクトのランキング順位一覧
    http.get("/api/internal/projects/:project_id/stats", ({ params }) => {
        const project = getProjectByIdOrName(params.project_id as string);
        if (!project) {
            return new HttpResponse(null, { status: 404 });
        }

        const sortedProjects = [...mockProjects].sort(
            (a, b) => (b.balance ?? 0) - (a.balance ?? 0)
        );
        const rank = sortedProjects.findIndex(p => p.id === project.id) + 1;

        const statItem = {
            rank,
            value: project.balance ?? 0,
            difference: 0,
            project, // Updated: spec now correctly uses "project" instead of "user"
        };

        return HttpResponse.json({
            balance: statItem,
            difference: { ...statItem, value: 0 },
            in: { ...statItem, value: 10000 },
            out: { ...statItem, value: 5000 },
            count: { ...statItem, value: 50 },
            total: { ...statItem, value: 15000 },
            ratio: { ...statItem, value: 5 },
        });
    }),

    // GET /internal/projects/:project_id/admins - 管理者一覧
    http.get("/api/internal/projects/:project_id/admins", ({ params }) => {
        const project = getProjectByIdOrName(params.project_id as string);
        if (!project) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(project.admins ?? []);
    }),

    // POST /internal/projects/:project_id/admins - 管理者追加
    http.post("/api/internal/projects/:project_id/admins", ({ params }) => {
        const project = getProjectByIdOrName(params.project_id as string);
        if (!project) {
            return new HttpResponse(null, { status: 404 });
        }
        return new HttpResponse(null, { status: 204 });
    }),

    // DELETE /internal/projects/:project_id/admins - 管理者削除
    http.delete("/api/internal/projects/:project_id/admins", ({ params }) => {
        const project = getProjectByIdOrName(params.project_id as string);
        if (!project) {
            return new HttpResponse(null, { status: 404 });
        }
        return new HttpResponse(null, { status: 204 });
    }),

    // GET /internal/projects/:project_id/clients - APIクライアント一覧
    http.get("/api/internal/projects/:project_id/clients", ({ params }) => {
        const project = getProjectByIdOrName(params.project_id as string);
        if (!project) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(mockAPIClients);
    }),

    // POST /internal/projects/:project_id/clients - APIクライアント発行
    http.post("/api/internal/projects/:project_id/clients", ({ params }) => {
        const project = getProjectByIdOrName(params.project_id as string);
        if (!project) {
            return new HttpResponse(null, { status: 404 });
        }
        const newClient = {
            clientId: `client_${generateUUID().substring(0, 8)}`,
            clientSecret: `secret_${generateUUID()}`, // 作成時のみ返却
            createdAt: new Date().toISOString(),
        };
        return HttpResponse.json(newClient, { status: 201 });
    }),

    // DELETE /internal/projects/:project_id/clients/:client_id - APIクライアント削除
    http.delete("/api/internal/projects/:project_id/clients/:client_id", ({ params }) => {
        const project = getProjectByIdOrName(params.project_id as string);
        if (!project) {
            return new HttpResponse(null, { status: 404 });
        }
        return new HttpResponse(null, { status: 204 });
    }),
];

// ========== Public API ハンドラー ==========
const publicHandlers = [
    // GET /v1/project - 自プロジェクト情報
    http.get("/api/v1/project", () => {
        return HttpResponse.json(mockPublicProject);
    }),

    // GET /v1/project/transactions - 取引履歴
    http.get("/api/v1/project/transactions", ({ request }) => {
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get("limit")) || 20;

        const items = mockPublicTransactions.slice(0, limit);
        return HttpResponse.json({
            items,
            next_cursor: undefined,
        });
    }),

    // POST /v1/transactions - ユーザーへ送金
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

    // POST /v1/bills - 請求作成
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
                expires_at: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30分後
            },
            { status: 201 }
        );
    }),

    // GET /v1/bills/:bill_id - 請求ステータス
    http.get("/api/v1/bills/:bill_id", ({ params }) => {
        const bill = mockPublicBills.find(b => b.id === params.bill_id);
        if (!bill) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(bill);
    }),
];

export const handlers = [...internalHandlers, ...publicHandlers];
