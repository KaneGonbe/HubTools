# Kakeibo 家計簿アプリ - セットアップガイド

## 🚀 クイックスタート

### 前提条件
- Node.js 16.x 以上
- npm または yarn

### 1. プロジェクトのセットアップ

```bash
# プロジェクトディレクトリに移動
cd kakeibo-frontend

# 依存関係をインストール
npm install
```

### 2. 環境変数の設定

```bash
# .env.example を .env にコピー
cp .env.example .env

# .env ファイルを編集（必要に応じて）
# デフォルトでは http://localhost:5000/api を使用
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

## 📁 プロジェクト構成

```
kakeibo-frontend/
├── src/
│   ├── main.jsx              # アプリケーションのエントリーポイント
│   ├── App.jsx               # ルートコンポーネント（認証管理）
│   ├── AuthPage.jsx          # ログイン・新規登録ページ
│   ├── kakeibo-app.jsx       # メインの家計簿機能
│   └── api.js                # APIクライアント
├── index.html                # HTMLテンプレート
├── vite.config.js            # Vite設定
├── package.json              # 依存関係
├── .env.example              # 環境変数のサンプル
└── README.md                 # プロジェクト説明
```

## 🎨 主な機能

### 実装済み機能

✅ **認証機能**
- ユーザー登録（名前、メール、パスワード、締め日設定）
- ログイン
- JWT認証（準備済み）

✅ **ダッシュボード**
- 収入・支出・残高のサマリー表示
- カテゴリ別内訳トップ5
- 最近の取引履歴

✅ **取引管理**
- 取引の追加・編集・削除
- 収入/支出の切り替え
- カテゴリ選択
- グループ設定
- 公開/非公開設定
- 日付・金額・メモの記録

✅ **フィルタリング**
- 種別フィルタ（すべて/収入/支出）
- グループフィルタ（すべて/個人/各グループ）

✅ **グループ機能**
- グループ一覧表示
- オーナー/メンバーの役割表示

### 今後実装予定

🚧 **集計機能**
- 期間指定での集計
- 月次・年次レポート
- カテゴリ別詳細分析

🚧 **データビジュアライゼーション**
- グラフ・チャート表示
- トレンド分析

🚧 **追加機能**
- カテゴリのカスタマイズ
- 予算設定
- エクスポート機能（CSV/PDF）
- ダークモード

## 🔧 開発Tips

### モック認証の使用

現在はバックエンドなしでも動作するようモック認証を実装しています。
実際のバックエンドAPI接続は `src/api.js` と各コンポーネントのコメント部分を参照してください。

### API連携の準備

`src/api.js` にすべてのAPI呼び出し関数が定義されています:

```javascript
// 使用例
import { transactionAPI, authAPI } from './api';

// トランザクション取得
const transactions = await transactionAPI.getAll({ 
  type: 'expense',
  group_id: 1 
});

// ログイン
const response = await authAPI.login({ 
  email: 'user@example.com',
  password: 'password' 
});
```

### スタイリング

現在はReactコンポーネント内でインラインスタイルを使用しています。
CSS Modulesや他のスタイリングソリューションへの移行も可能です。

## 📝 コンポーネント詳細

### App.jsx
- 認証状態を管理
- ログイン済みユーザーには `KakeiboApp` を表示
- 未認証ユーザーには `AuthPage` を表示

### AuthPage.jsx
- ログイン/新規登録の切り替え
- フォームバリデーション
- エラーハンドリング

### kakeibo-app.jsx
- ダッシュボード、取引履歴、グループの3つのビュー
- 取引のCRUD操作
- リアルタイムでの集計計算
- レスポンシブデザイン

## 🛠️ トラブルシューティング

### ポート3000が使用中の場合

vite.config.jsでポートを変更:
```javascript
export default defineConfig({
  server: {
    port: 3001, // 任意のポート番号
  }
});
```

### ビルドエラーが発生する場合

```bash
# node_modulesとキャッシュをクリア
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 🌐 バックエンド連携

このフロントエンドは以下のバックエンドAPIエンドポイントを想定しています:

- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン
- `GET /api/auth/profile` - プロフィール取得
- `GET /api/transactions` - トランザクション一覧
- `POST /api/transactions` - トランザクション作成
- `PUT /api/transactions/:id` - トランザクション更新
- `DELETE /api/transactions/:id` - トランザクション削除
- `GET /api/categories` - カテゴリ一覧
- `GET /api/groups` - グループ一覧

詳細なAPI仕様はバックエンドのドキュメントを参照してください。

## 📦 本番環境へのデプロイ

### ビルド

```bash
npm run build
```

`dist/` ディレクトリに最適化されたファイルが生成されます。

### 主なホスティングオプション

- **Vercel**: `vercel` コマンドで簡単デプロイ
- **Netlify**: ドラッグ&ドロップでデプロイ
- **GitHub Pages**: 静的ホスティング
- **AWS S3 + CloudFront**: エンタープライズ向け

## 🤝 コントリビューション

バグ報告や機能追加のリクエストは大歓迎です！

## 📄 ライセンス

MIT License

---

**Created with Claude AI**
