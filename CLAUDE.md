# 個人ホームページ

詳細仕様は docs/spec.md を参照すること。

## 技術構成
- Astro（静的サイト。SSRやDBは使わない）
- アニメーション：GSAP（ScrollTrigger）、CSS、Astro View Transitions
- 公開先：Cloudflare Workers（静的アセット配信。GitHub 連携で push 時に自動デプロイ、設定は wrangler.jsonc）
- お問い合わせは外部フォームサービスを使用（自前の送信処理は作らない）
- リポジトリ：REN_HP（このディレクトリ直下が Astro プロジェクトのルート）

## ページ
HOME / ABOUT / NEWS / HISTORY / ACHIEVEMENTS / CONTACT
- プライバシーポリシーは独立ページにせず、CONTACT 内の節（/contact#privacy）に置く
- HISTORY と ACHIEVEMENTS は独立させ、相互リンクしない

## データ管理
- NEWS：src/content/news/ の Markdown（1記事1ファイル、前書きは title / date / category。分類はカテゴリのみ）
- HISTORY / ACHIEVEMENTS / クレジット：src/data/ の YAML
- サイト名・SNSリンク：src/data/site.yaml（ヘッダー・フッター・ABOUT で共通利用）
- 写真（プロフィール・実績画像）：src/assets/（Astro の画像最適化を使う）
- 動画・ポスター画像・歩行スプライト：public/
- 共通レイアウト：src/layouts/BaseLayout.astro
- 本番素材が揃うまではダミーデータ・仮素材で進める

## ルール
- ライブラリは npm で導入し、CDN は使わない
- prefers-reduced-motion ではアニメーションを止める（HISTORY は PC でも縦タイムラインに切り替える）
- スマホ表示にも対応する（HISTORY はスマホでは縦タイムライン。HOME の背景動画はスマホでも再生する）
- HOME のローディング演出はセッションごとに1回（sessionStorage で判定）
- View Transitions 使用時は GSAP / ScrollTrigger をページ遷移ごとに破棄・再初期化する
- 多言語対応（英語・中国語）は後日検討。今は日本語のみで作る
- APIキーなどの秘密情報はコードに書かない
- コメントと説明は日本語で

## コマンド
- 開発サーバー：npm run dev
- ビルド確認：npm run build
