# AGENTS.md

Sax Finger: 選んだ音の運指をサックスのイラストで表示するWebアプリ。
React 19 + Vite + TypeScript + Tailwind CSS 4 / Firebase Hostingのみの完全静的アプリ(Firestore不使用)。

## ルール

1. 不明点は推測せず、必ずユーザーに質問して確認してから作業する
2. 作業単位ごとにユーザーのレビューを受け、コミットしてから次に進む
3. 仕様確認 → BDD振る舞いテスト → TDDユニットテスト → プロダクションコード実装 → Green の順で進める
4. 作業ごとにGitHub Issueを作成してから着手する
5. PRにはユーザーがレビューすべき内容を明記する
6. 秘密情報はコードに書かず、GitHub Secretsに保管する
7. MVPから除外した機能は `backlog` ラベルのIssueで追跡する。勝手に実装せず、着手前にユーザーに確認する
8. ドキュメント・コード・回答はすべて「必要十分で情報は多いが無駄のないシンプルな記述」にする。メタな説明や重複を書かない

## 参照

| 状況 | 参照先 |
| --- | --- |
| 機能・仕様・技術スタック | [README.md](./README.md) |
| 実装作業(開発サイクル、BDD/TDDの手順、テスト) | [DEVELOPMENT.md](./DEVELOPMENT.md) |
| git / GitHub操作(commit・push・Issue・PR・ブランチ) | [DEVELOPMENT.md](./DEVELOPMENT.md)「リポジトリ・アカウント」「ブランチ・コミット規約」 |
| CI/CD・デプロイ・インフラ | [DEVELOPMENT.md](./DEVELOPMENT.md)「CI/CD」「デプロイ」「インフラ」 |
| 設計・画面・運指データ・SVGキー定義・バックログ | `docs/design.md` |
| Claude Codeのhook等ハーネス設定 | [DEVELOPMENT.md](./DEVELOPMENT.md)「AI駆動開発のハーネス」 |

## コマンド

```bash
npm run dev          # 開発サーバー (http://localhost:5173)
npm run lint         # ESLint
npm run test         # Vitest(ユニットテスト)
npm run test:e2e     # playwright-bdd(振る舞いテスト)
npm run build        # 本番ビルド
```
