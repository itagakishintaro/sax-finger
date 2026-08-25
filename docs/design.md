# Sax Finger 全体設計書

## 概要

サックスの運指を楽器イラストで表示するWebアプリ。音（ドレミ+オクターブ+#/♭）を選択すると、押さえるキーを赤く着色したサックス全体のイラストを表示する。楽器と照らし合わせながら運指を確認できることを最優先とする。

- 対象楽器: サックス族共通（汎用サックスイラスト1種で表示）
- 音域: サックス全音域（記譜音 シ♭3〜ファ#6）
- 表記: 記譜音のドレミ（カタカナ）のみ
- 認証なし・データ保存なし（完全静的アプリ）

## 技術スタック

rinban（/Users/shintaro.itagaki/dev/rinban）の構成を踏襲し、Firestore関連を除いたもの。

| 分類 | 技術 |
| --- | --- |
| フロントエンド | React 19 + TypeScript + Vite |
| スタイル | Tailwind CSS 4 |
| イラスト | インラインSVG（自作コンポーネント、キーを動的着色） |
| ユニットテスト | Vitest + Testing Library |
| 振る舞いテスト | Playwright + playwright-bdd（日本語Gherkin） |
| ホスティング | Firebase Hosting（Firestore・Functions・Auth 不使用） |
| CI/CD | GitHub Actions（PR時CI必須 / mainマージでHosting自動デプロイ） |

- GitHubリポジトリ: `itagakishintaro/sax-finger`（個人アカウント。remoteは `git@github.com-personal:` 経由、`gh auth switch -u itagakishintaro`）
- FirebaseプロジェクトID: `sax-finger`（重複時はサフィックス付与）、ロケーション: asia-northeast1
- react-router は使わない（単一画面のため。画面が増えたら導入）

## 画面設計

1画面構成。五線譜上の音符を直接タップして音を選択し、下部に運指イラストを表示する。オクターブの切替ボタンは設けず、音の高さは五線譜の位置で直感的に選ばせる。

```
┌─────────────────────────────────┐
│ Sax Finger                              │
│                                         │
│ 変化記号:  [♭] [♮] [#]                  │
│ ┌─────────────────────────────┐ │
│ │ 𝄞 ──────────────────────────  │ │
│ │   ♩ ♩ ♩ ♩ ♩ ♩ ♩ ♩ ♩ ♩ …       │ │ ← 五線譜（横スクロール可）
│ │   ド レ ミ ファ ソ ラ シ ド …      │ │    音符タップで選択
│ └─────────────────────────────┘ │
│                                         │
│  ┌───────────────┐  選択中: ソ#（=ラ♭）  │
│  │  サックスSVG    │                     │
│  │  押さえるキーを  │                     │
│  │  赤く表示       │                     │
│  └───────────────┘                     │
└─────────────────────────────────┘
```

- 五線譜（ト音記号）に記譜音シ♭3〜ファ#6の音符を音高順に横に並べる。各音符の下にカタカナ音名を添える（添付イラストと同じ見せ方）。画面幅を超える分は横スクロール
- 音符をタップすると選択され、強調表示（色変え）される。同時に下部の運指イラストが切り替わる
- 変化記号トグル: ♮（デフォルト）では幹音のみ表示。#または♭を選ぶと、五線譜上の各音符に臨時記号を付けた音（例: #ならド#・レ#…）が選択対象になる。適用結果が音域外・非対応となる音符（例: ミ#・シ#・ファ♭・ド♭、ファ#6より上）は無効表示にする
- 異名同音（ド# = レ♭ など）はどちらからでも選択でき、同じ運指を表示する
- 選択中の音名は「ソ#（= ラ♭）」の形式で表示する（音の高さは五線譜上の選択位置で示されるため、オクターブの言葉は使わない）

## 運指イラスト（SVG）

- サックス全体を縦構図で描いた自作SVGコンポーネント。添付イラストと同様に、楽器の形（ネック・本体・ベル）とキー配置を再現し、実物と照らし合わせやすくする
- 各キーは `data-key="<KeyId>"` 属性を持つSVG要素。押さえるキーは赤（`fill`）、押さえないキーは白で描画
- 裏側のオクターブキー（左手親指）は本体脇に別枠で表示する
- キーの状態がDOM属性で検証できるため、BDD/ユニットテスト双方でアサート可能

### キー定義（KeyId）

| KeyId | キー | 操作 |
| --- | --- | --- |
| octave | オクターブキー | 左手親指 |
| palmD / palmEb / palmF | パームキー D / E♭ / F | 左手の平 |
| frontF | フロントFキー | 左手人差指 |
| L1 / L2 / L3 | 左手メインキー 1〜3 | 左手人差指・中指・薬指 |
| bis | ビスキー | 左手人差指 |
| gSharp / lowCsharp / lowB / lowBb | テーブルキー G# / 低C# / 低B / 低B♭ | 左手小指 |
| R1 / R2 / R3 | 右手メインキー 1〜3 | 右手人差指・中指・薬指 |
| sideE / sideC / sideBb | サイドキー E / C / B♭ | 右手の平・人差指 |
| highFsharp | 高F#キー | 右手中指 |
| lowEb / lowC | 低E♭ / 低C キー | 右手小指 |

## 運指データ（ドメインモデル）

運指マスタは静的なTypeScriptデータとして `src/domain/` に持つ（Firestore不使用）。

```ts
type PitchName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
type Accidental = 'natural' | 'sharp' | 'flat';
interface Note {
  pitch: PitchName;
  accidental: Accidental;
  octave: 3 | 4 | 5 | 6; // 記譜音（科学的ピッチ表記）
}
// 運指マスタ: 半音単位のキー（例 'A#4'）→ 押さえるKeyIdの配列
const fingerings: Record<string, KeyId[]>;
// 異名同音の正規化（レ♭4 → C#4）もdomainの純粋関数で行う
```

### 運指表（基本運指・記譜音）

| 音 | 運指 |
| --- | --- |
| シ♭3 | L1 L2 L3 R1 R2 R3 + 低B♭ |
| シ3 | L1 L2 L3 R1 R2 R3 + 低B |
| ド4 | L1 L2 L3 R1 R2 R3 + 低C |
| ド#4 | L1 L2 L3 R1 R2 R3 + 低C# |
| レ4 | L1 L2 L3 R1 R2 R3 |
| ミ♭4 | L1 L2 L3 R1 R2 R3 + 低E♭ |
| ミ4 | L1 L2 L3 R1 R2 |
| ファ4 | L1 L2 L3 R1 |
| ファ#4 | L1 L2 L3 R2 |
| ソ4 | L1 L2 L3 |
| ソ#4 | L1 L2 L3 + G# |
| ラ4 | L1 L2 |
| シ♭4 | L1 + ビス |
| シ4 | L1 |
| ド5 | L2 |
| ド#5 | 開放（なし） |
| レ5〜ド#6 | レ4〜ド#5 と同じ + オクターブキー |
| レ6 | オクターブ + パームD |
| ミ♭6 | オクターブ + パームD + パームE♭ |
| ミ6 | オクターブ + パームD + パームE♭ + サイドE |
| ファ6 | オクターブ + パームD + パームE♭ + パームF + サイドE |
| ファ#6 | オクターブ + パームD + パームE♭ + パームF + サイドE + 高F# |

- MVPは基本運指のみ。替え指（サイドB♭、フォークF#、フロントF系など）は将来機能として切替表示を検討
- 実装時に市販運指表と照合して最終確定する

## ディレクトリ構成

```
sax-finger/
├── AGENTS.md            # AI向けグラウンドルール + 参照マップ
├── README.md            # 機能・仕様・技術スタック
├── DEVELOPMENT.md       # 開発手順・規約・CI/CD
├── docs/design.md       # 本書
├── src/
│   ├── domain/          # Note型・運指マスタ・正規化などの純粋関数（TDD対象）
│   ├── components/      # SaxDiagram(サックスSVG), StaffSelector(五線譜SVG) など
│   ├── App.tsx / main.tsx / index.css
│   └── test/setup.ts
├── features/            # BDD（日本語Gherkin *.feature + steps/）
├── scripts/setup-infra.sh  # Firebase/GCP/GitHub 構築の冪等スクリプト
├── .github/workflows/   # ci.yml（PR時） / deploy.yml（main→Hosting）
├── .claude/             # settings.json + hooks/format.sh（Prettier自動整形）
└── firebase.json / .firebaserc / vite.config.ts ほか
```

## テスト戦略

| 種類 | 場所 | 実行 | 内容 |
| --- | --- | --- | --- |
| 振る舞いテスト（BDD） | `features/` | `npm run test:e2e` | 「五線譜のソをタップするとL1L2L3が赤く表示される」等のシナリオ |
| ユニットテスト（TDD) | `src/**/*.test.ts(x)` | `npm run test` | 運指マスタの網羅検証・異名同音正規化・音域外判定 |

- Firestore不使用のため、ルールテスト・エミュレータは持たない（Java不要、CIも軽量）
- 開発サイクル: 仕様確認 → BDD振る舞いテスト → TDDユニットテスト → 実装 → Green

## CI/CD・ハーネス

- `ci.yml`: PR時に lint → test → build → test:e2e。全てGreenでないとマージ不可
- `deploy.yml`: mainへのpushで build → Firebase Hosting自動デプロイ（サービスアカウントは `FIREBASE_SERVICE_ACCOUNT` シークレット）
- Claude Code: PostToolUse hookでEdit/Write後にPrettier自動整形。権限allowlistは設けずAuto Mode運用
- ドキュメント分担: AGENTS.md=ルール / README.md=仕様 / DEVELOPMENT.md=開発手順 / docs/design.md=設計。重複させない

## 開発マイルストーン

作業ごとにGitHub Issueを起票して進める（番号は起票時に採番。全体設計 = Issue #1）。

| 順 | 内容 |
| --- | --- |
| 1 | 全体設計（本書のレビュー・確定） |
| 2 | 開発基盤: AGENTS.md/README/DEVELOPMENT.md、Viteスケルトン、テスト基盤、CI/CD、インフラ構築 |
| 3 | MVP: 五線譜で中央1オクターブ（ド4〜シ4の幹音）を選択 + SVG運指表示 |
| 4 | 全音域対応: 五線譜を最低音シ♭3〜最高音ファ#6に拡張（加線・横スクロール） |
| 5 | #/♭対応: 変化記号トグル、臨時記号付き音符の表示、異名同音、音域外の無効化 |
| 6 | イラスト改善: 添付イラスト同等の見た目に仕上げる（配色・形状） |

各Issueで feature ブランチ → BDD/TDD → PR → レビュー → マージの順で進める。

## 将来機能（バックログ）

MVPから除外したもの。GitHub Issueに `backlog` ラベルで起票済み。忘れないよう追跡する。

| Issue | 項目 | 内容 |
| --- | --- | --- |
| #2 | 替え指表示 | サイドB♭・フォークF#・フロントF系などの代替運指を切替表示する |
| #4 | PWA対応 | rinban/run同様にvite-plugin-pwaでオフライン利用・ホーム画面追加に対応する |
| #5 | 実音表記切替 | アルト（E♭管）/テナー（B♭管）の実音表示を切り替えられるようにする |
| #6 | Firestore導入 | お気に入り・練習記録などの保存機能が必要になった場合に導入する |
