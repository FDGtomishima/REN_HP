# 個人ホームページ 構成・仕様書

Nov 17, 2026 · @tomishima

## 概要

Astro で作る静的サイトを基本とし、DB・自前サーバーを持たない構成にする。ニュースは Markdown ファイルを追加するだけで更新でき、お問い合わせは外部フォームサービスに任せる。

- **目的**：個人の活動・プロフィール・歩み・実績を伝え、最新情報を発信する
- **ページ**：HOME / ABOUT / NEWS / HISTORY / ACHIEVEMENTS / CONTACT の6つ
- **見せ場**：HOME の動画背景と、HISTORY の「歩く人物＋横スクロール年表」
- **方針**：表示の速さ・安全性・更新のしやすさを優先し、動きは要所に絞る

## 技術構成

すべて無料枠で始められる構成で、固定費用は独自ドメイン代（年1,000〜2,000円程度）のみを想定。

| 役割 | 使うもの | 備考 |
| --- | --- | --- |
| フレームワーク | Astro | 静的HTMLを生成。コンテンツコレクションでNEWSを管理 |
| コード・記事の管理 | GitHub（privateリポジトリ） | pushで自動デプロイ |
| ホスティング | Cloudflare Workers（静的アセット配信） | GitHub連携（Workers Builds）でpush時に自動デプロイ。HTTPS自動対応、`_headers` でセキュリティヘッダー設定、設定は `wrangler.jsonc` |
| アニメーション | GSAP（ScrollTrigger）、CSS、Astro View Transitions | npmで導入（CDNは使わない） |
| お問い合わせ | 外部フォーム（Formspree / Tally / Googleフォーム / formrun から選択） | 自前でデータを持たない |
| デザイン | Figma | ラフは紙でも可。動きはコードで試作して確認 |
| 歩行アニメ素材 | スプライトシート（または Lottie / Rive） | イラストは Figma・Illustrator・Procreate など |
| ドメイン | Cloudflare Registrar など | 構成を変えてもURLを維持できる |

更新が面倒になったら、Keystatic などのGitベースの管理画面を後から追加できる。

## ページ別仕様

6ページ構成で、更新が頻繁なのは NEWS のみ。HOME の最新情報は NEWS から自動で取得する。

```
HOME ──── NEWS 最新3件を表示（src/content/news/）
ABOUT ─── ページに直接記述
NEWS ──── 一覧 / 記事ページ（src/content/news/）
HISTORY ─ src/data/history.yaml
ACHIEVEMENTS ─ src/data/achievements.yaml
CONTACT ─ 外部フォーム、プライバシーポリシー、src/data/credits.yaml
共通 ──── サイト名・SNSリンク（src/data/site.yaml）
```

ページの中身はデータファイルから生成され、NEWS の記事は HOME の最新情報にも使われる。

### HOME

- 画面全体にループ動画を背景として敷き、半透明の暗いレイヤーを重ねて文字を読みやすくする
- 上部にナビゲーション、下部に NEWS の最新 3 件と「一覧を見る」リンク
- 動画は `autoplay muted loop playsinline` を指定し、`poster` 画像を用意
- 動画は 10〜20 秒・数MB程度に圧縮、つなぎ目が自然な素材を使う
- スマホでも動画を再生する（`poster` は読み込み中・再生できない環境の代替）
- セッションごとに1回だけ短いローディング演出（1〜2秒以内、任意。`sessionStorage` で判定）

### ABOUT

- 一般的なプロフィール画面：写真、名前・肩書き、自己紹介文、スキル・趣味、SNSリンク
- PCは左に写真・右に文章、スマホは縦並び
- 内容はページに直接記述

### NEWS

- 一覧ページ：日付・タイトル・カテゴリを新しい順に表示
- 記事ページ：本文、日付、前後の記事へのリンク
- 記事が増えたらページ送り、カテゴリ絞り込み、RSS を追加
- 1記事 = 1 Markdown ファイル（title / date / category を前書きに記述）
- 分類はカテゴリ（1記事につき1つ）のみ。タグは使わない

### HISTORY

- 画面左に「歩く人物」を固定表示
- 縦スクロールを横の動きに変換し、年表の項目が右から流れてきて、人物のあたりで消えていく
- 実装：GSAP ScrollTrigger の `pin` + `scrub` で横移動、`containerAnimation` で各項目のフェードイン／アウト
- 人物はスクロール中だけ歩き、止まると立ち止まる。戻る方向では左右反転
- 年表は `history.yaml` から自動生成（項目を足すと横幅も自動で伸びる）
- スマホ、および `prefers-reduced-motion` が有効な環境（PC含む）では縦のタイムライン表示に切り替える
- 役割：「流れ・ストーリー」を見せるページ。ACHIEVEMENTS とは独立させ、相互リンクはしない

### ACHIEVEMENTS

- 実績をカード状に一覧表示し、クリックでモーダルに詳細を表示
- モーダルは HTML 標準の `<dialog>` を使用（Esc で閉じる、背景クリックで閉じる）
- 詳細項目：タイトル、日付、画像、説明、関連リンク
- カテゴリ（受賞・資格・作品など）で絞り込むタブは任意
- データは `achievements.yaml` で管理

### CONTACT

- お問い合わせ：外部フォームを埋め込みまたはリンクで設置
- フォームの近くに個人情報の扱い（返信のみに使用、外部サービスに保存）を一文で明記
- 項目は名前・メールアドレス・内容のみ。通知先と自動返信を設定
- 制作クレジット：`credits.yaml` の名前・担当・リンクを一覧表示（エンドロール風の演出も可）
- 掲載する方には名前・リンクの掲載了承を事前にもらう
- プライバシーポリシー：CONTACT ページ内の節として掲載（独立ページは作らない）。フッターからはこの節（`/contact#privacy`）へリンク

## 共通部品とアニメーション方針

演出は HOME と HISTORY に集中させ、読ませるページ（ABOUT・NEWS）は控えめにする。

**共通部品**

- ヘッダー：サイト名（ロゴ、`site.yaml` から取得）と各ページへのメニュー。スマホはハンバーガーメニュー。HOME では動画の上に透過表示
- フッター：コピーライト、SNSリンク（`site.yaml` から取得、ABOUT と共通）、プライバシーポリシー（CONTACT 内）へのリンク
- 共通レイアウト：`BaseLayout.astro` にまとめる

| 場所 | 演出 | 実装 |
| --- | --- | --- |
| 全ページ | ページ切り替えを滑らかに | Astro View Transitions（`ClientRouter`） |
| HOME | ループ動画背景、セッションごとに1回のローディング | `<video>` + CSS、`sessionStorage` |
| HISTORY | 歩く人物、横スクロール年表 | GSAP ScrollTrigger、CSS `steps()` |
| ACHIEVEMENTS | カードの順次表示、モーダルの開閉 | Intersection Observer、`<dialog>` |
| CONTACT | クレジットのエンドロール風表示（任意） | CSS アニメーション |

**共通ルール**

- OSの「視差効果を減らす」設定（`prefers-reduced-motion`）ではアニメーションを止める
- スマホでは重い演出を簡易版に切り替える（ただし HOME の背景動画はスマホでも再生する）
- View Transitions でページを切り替えるため、GSAP / ScrollTrigger はページ遷移ごとに破棄・再初期化する

## データ管理とディレクトリ構成

更新頻度に合わせて管理方法を分け、どれもファイルを編集して push するだけで反映される。

| データ | 形式 | 場所 |
| --- | --- | --- |
| NEWS 記事 | Markdown（1記事1ファイル） | `src/content/news/` |
| HISTORY 年表 | YAML | `src/data/history.yaml` |
| ACHIEVEMENTS 実績 | YAML | `src/data/achievements.yaml` |
| 制作クレジット | YAML | `src/data/credits.yaml` |
| サイト名・SNSリンク | YAML | `src/data/site.yaml` |
| ABOUT 本文 | ページに直接記述 | `src/pages/about.astro` |
| 写真（プロフィール・実績画像など） | 画像ファイル（Astro の画像最適化を使う） | `src/assets/` |
| 動画・ポスター画像・歩行スプライト | 静的ファイル | `public/` |

```
src/
├── pages/
│   ├── index.astro          … HOME
│   ├── about.astro          … ABOUT
│   ├── news/
│   │   ├── index.astro      … NEWS一覧
│   │   └── [slug].astro     … NEWS個別記事
│   ├── history.astro        … HISTORY
│   ├── achievements.astro   … ACHIEVEMENTS
│   └── contact.astro        … CONTACT
├── content/news/            … ニュース記事（Markdown）
├── data/                    … history / achievements / credits / site のYAML
├── assets/                  … 写真（画像最適化の対象）
├── layouts/BaseLayout.astro … 共通ヘッダー・フッター
└── components/              … カード、モーダル、歩行人物など
public/
├── _headers                 … セキュリティヘッダー
└── (動画・ポスター画像・スプライト)
wrangler.jsonc               … Cloudflare Workers の設定
```

**NEWS の更新フロー**

1. `src/content/news/` に Markdown ファイルを追加（GitHub のWeb画面からでも可）
2. GitHub に push
3. Cloudflare Workers（Workers Builds）が自動ビルド・デプロイし、NEWS 一覧と HOME の最新情報に反映

## セキュリティ・プライバシー対策

DB・管理画面・自前サーバーがないため、サイト自体への攻撃リスクは低い。注意すべきは「管理アカウントの乗っ取り」と「個人情報の出しすぎ」。

- [ ] GitHub・ホスティング・ドメイン・外部フォームの各アカウントで2段階認証を有効化
- [ ] パスワードは使い回さず、パスワードマネージャーで管理
- [ ] GitHubリポジトリを private にする
- [ ] `.env` を `.gitignore` に追加し、秘密情報はホスティングの環境変数で管理
- [ ] 外部フォームのスパム対策を有効化、項目は最小限
- [ ] フォーム付近とフッターからプライバシーポリシーを確認できるようにする
- [ ] `package-lock.json` をコミットし、Dependabot を有効化
- [ ] `public/_headers` でセキュリティヘッダーを設定
- [ ] 写真の位置情報（EXIF）を削除してから掲載し、生活圏が分かる情報は出さない
- [ ] 制作クレジット掲載者から了承を得る

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

後から管理画面（Keystatic など）を追加する場合は、GitHub ログイン経由の認証にして自分以外が入れないようにする。外部フォームを iframe で埋め込む場合、将来 CSP を設定するときはそのドメインを許可する。

## 必要な素材と開発の進め方

素材が揃う前でも、仮素材で骨組みと動きを先に作れる。

**用意する素材**

- [ ] HOME 用の背景動画（10〜20秒、ループ可）とポスター画像
- [ ] HISTORY 用の歩行アニメーション（スプライトシートまたは Lottie）
- [ ] ABOUT 用のプロフィール写真
- [ ] ACHIEVEMENTS 用の各実績の画像
- [ ] 年表・実績・クレジットのテキスト
- [ ] ロゴ、サイト名、配色・フォント

**開発の進め方**

1. ラフで配置を決め、Figma で HOME と HISTORY を先にデザインして雰囲気を確定（デザイン確定前は仮の配色・仮素材・ダミーデータで 2 以降を先行してよい）
2. Astro プロジェクト作成、共通レイアウトと6ページの骨組み
3. NEWS の Markdown 管理と HOME の最新情報連動
4. HISTORY・ACHIEVEMENTS・credits の YAML データ化
5. HISTORY の横スクロールと歩行アニメ、ACHIEVEMENTS のモーダルを実装
6. デザインの仕上げ、スマホ対応、`prefers-reduced-motion` 対応
7. GitHub と Cloudflare Workers を連携して公開、独自ドメイン設定
8. セキュリティチェックリストを確認

**未決事項**

- 外部フォームのサービス（Formspree / Tally / Googleフォーム / formrun）と設置方法（埋め込み or リンク）
- サイトのデザインの雰囲気と配色
- 多言語対応（英語・中国語の追加）：後日検討。現時点では日本語のみで作る
