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
import apis from "/@/api";

const { data } = await apis.internal.me.getMe();
console.log(data.name); // "alice"
console.log(data.balance); // 15000
```

### 2. ユーザー一覧を取得

```typescript
const { data } = await apis.internal.users.usersList({ limit: 10 });
data.items.forEach(user => {
    console.log(`${user.name}: ${user.balance}円`);
});
```

### 3. ユーザーランキングを取得

```typescript
const { data } = await apis.internal.stats.usersDetail("balance", {
    term: "7days",
    limit: 10,
});
data.items?.forEach(item => {
    console.log(`#${item.rank} ${item.user?.name}: ${item.value}円`);
});
```

### 4. プロジェクト一覧を取得

```typescript
const { data } = await apis.internal.projects.projectsList();
data.items.forEach(project => {
    console.log(`${project.name}: ${project.balance}円`);
});
```

### 5. ユーザーへ送金 (Public API)

```typescript
const { data } = await apis.public.transactions.transactionsCreate({
    to_user: "bob",
    amount: 1000,
    description: "テスト送金",
});
console.log(`送金完了: ${data.id}`);
```

### 6. 請求を作成 (Public API)

```typescript
const { data } = await apis.public.bills.billsCreate({
    target_user: "charlie",
    amount: 500,
    description: "サービス利用料",
    success_url: "https://example.com/success",
    cancel_url: "https://example.com/cancel",
});
console.log(`決済URL: ${data.payment_url}`);
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

| メソッド | パス                                         | 説明                         |
| -------- | -------------------------------------------- | ---------------------------- |
| GET      | `/me`                                        | 自分の情報を取得             |
| GET      | `/me/bills/{bill_id}`                        | 請求の詳細を取得             |
| POST     | `/me/bills/{bill_id}/approve`                | 請求を承認                   |
| POST     | `/me/bills/{bill_id}/decline`                | 請求を拒否                   |
| GET      | `/transactions`                              | 全取引履歴                   |
| GET      | `/transactions/users/{user_id}`              | ユーザーの取引履歴           |
| GET      | `/transactions/projects/{project_id}`        | プロジェクトの取引履歴       |
| GET      | `/stats`                                     | 経済圏全体の統計             |
| GET      | `/stats/users`                               | ユーザー関連統計             |
| GET      | `/stats/projects`                            | プロジェクト関連統計         |
| GET      | `/stats/users/{ranking_name}`                | ユーザーランキング           |
| GET      | `/stats/projects/{project_name}`             | プロジェクトランキング       |
| GET      | `/users`                                     | 全ユーザー一覧               |
| GET      | `/users/{user_id}`                           | ユーザー詳細                 |
| GET      | `/users/{user_id}/balance`                   | ユーザー残高                 |
| GET      | `/users/{user_id}/stats`                     | ユーザーのランキング順位     |
| GET      | `/users/{user_id}/projects`                  | ユーザーのプロジェクト一覧   |
| GET      | `/projects`                                  | 全プロジェクト一覧           |
| POST     | `/projects`                                  | プロジェクト作成             |
| GET      | `/projects/{project_id}`                     | プロジェクト詳細             |
| PUT      | `/projects/{project_id}`                     | プロジェクト更新             |
| GET      | `/projects/{project_id}/balance`             | プロジェクト残高             |
| GET      | `/projects/{project_id}/stats`               | プロジェクトのランキング順位 |
| GET      | `/projects/{project_id}/admins`              | 管理者一覧                   |
| POST     | `/projects/{project_id}/admins`              | 管理者追加                   |
| DELETE   | `/projects/{project_id}/admins`              | 管理者削除                   |
| GET      | `/projects/{project_id}/clients`             | APIクライアント一覧          |
| POST     | `/projects/{project_id}/clients`             | APIクライアント発行          |
| DELETE   | `/projects/{project_id}/clients/{client_id}` | APIクライアント削除          |

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
