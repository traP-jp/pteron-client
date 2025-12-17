# MSW モック使用ガイド

pteron-clientのフロントエンド開発時に、バックエンド（pteron-server）なしでAPIをモックするための仕組みです。

## クイックスタート

```bash
# 開発サーバー起動（自動的にMSWが有効になります）
pnpm dev
```

ブラウザのコンソールに `[MSW] Mocking enabled.` と表示されれば成功です。

## 使用例

### 1. 自分の情報を取得

```typescript
import { api } from "../api/api";

// Internal API を使用
const { data, error } = await api.internal.GET("/me");
if (data) {
    console.log(data.name); // "alice"
    console.log(data.balance); // 15000
}
```

### 2. ユーザー一覧を取得

```typescript
const { data } = await api.internal.GET("/users", {
    params: { query: { limit: 10 } },
});
if (data) {
    data.items.forEach(user => {
        console.log(`${user.name}: ${user.balance}円`);
    });
}
```

### 3. 取引履歴を取得

```typescript
const { data } = await api.internal.GET("/me/transactions");
if (data) {
    data.items.forEach(tx => {
        const sign = tx.type === "TRANSFER" ? "+" : "-";
        console.log(`${sign}${tx.amount}円: ${tx.description}`);
    });
}
```

### 4. プロジェクト一覧を取得

```typescript
const { data } = await api.internal.GET("/projects");
if (data) {
    data.items.forEach(project => {
        console.log(`${project.name}: ${project.balance}円`);
    });
}
```

### 5. ユーザーへ送金 (Public API)

```typescript
const { data, error } = await api.public.POST("/transactions", {
    body: {
        to_user: "bob",
        amount: 1000,
        description: "テスト送金",
    },
});
if (data) {
    console.log(`送金完了: ${data.id}`);
}
```

### 6. 請求を作成 (Public API)

```typescript
const { data } = await api.public.POST("/bills", {
    body: {
        target_user: "charlie",
        amount: 500,
        description: "サービス利用料",
        success_url: "https://example.com/success",
        cancel_url: "https://example.com/cancel",
    },
});
if (data) {
    console.log(`決済URL: ${data.payment_url}`);
}
```

## モックデータのカスタマイズ

`data.ts` を編集してモックデータを変更できます。

```typescript
// 例: 現在のユーザーを変更
export const mockCurrentUser: User = {
    id: "your-custom-uuid",
    name: "your_username",
    balance: 99999,
};

// 例: プロジェクトを追加
export const mockProjects: Project[] = [
    // 既存のプロジェクト...
    {
        id: "new-project-uuid",
        name: "My New Project",
        owner_id: mockCurrentUser.id,
        admin_ids: [],
        balance: 10000,
    },
];
```

## ファイル構成

```
src/mocks/
├── README.md       # このファイル
├── browser.ts      # ブラウザ用MSW設定
├── data.ts         # モックデータ
├── handlers.ts     # APIハンドラー
└── index.ts        # エクスポート
```

## 対応API一覧

### Internal API (`/api/internal/*`)

| メソッド | パス                                         | 説明                   |
| -------- | -------------------------------------------- | ---------------------- |
| GET      | `/me`                                        | 自分の情報を取得       |
| GET      | `/me/transactions`                           | 自分の取引履歴を取得   |
| GET      | `/me/bills/{bill_id}`                        | 請求の詳細を取得       |
| POST     | `/me/bills/{bill_id}/approve`                | 請求を承認             |
| POST     | `/me/bills/{bill_id}/decline`                | 請求を拒否             |
| GET      | `/me/projects`                               | 自分のプロジェクト一覧 |
| GET      | `/users`                                     | 全ユーザー一覧         |
| GET      | `/leaderboard/{category}`                    | ランキング             |
| GET      | `/projects`                                  | 全プロジェクト一覧     |
| POST     | `/projects`                                  | プロジェクト新規作成   |
| GET      | `/projects/{project_id}`                     | プロジェクト詳細       |
| GET      | `/projects/{project_id}/admins`              | 管理者一覧             |
| POST     | `/projects/{project_id}/admins`              | 管理者追加             |
| DELETE   | `/projects/{project_id}/admins/{user_id}`    | 管理者削除             |
| GET      | `/projects/{project_id}/clients`             | APIクライアント一覧    |
| POST     | `/projects/{project_id}/clients`             | APIクライアント発行    |
| DELETE   | `/projects/{project_id}/clients/{client_id}` | APIクライアント削除    |

### Public API (`/api/v1/*`)

| メソッド | パス                    | 説明               |
| -------- | ----------------------- | ------------------ |
| GET      | `/project`              | 自プロジェクト情報 |
| GET      | `/project/transactions` | 取引履歴           |
| POST     | `/transactions`         | ユーザーへ送金     |
| POST     | `/bills`                | 請求作成           |
| GET      | `/bills/{bill_id}`      | 請求ステータス     |

## 注意事項

- MSWは開発環境（`pnpm dev`）でのみ有効です
- 本番ビルド（`pnpm build`）では自動的に無効になります
- モックへの変更は一時的で、ページをリロードするとリセットされます
