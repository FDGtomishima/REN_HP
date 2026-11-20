# 非公式ファンサイト（企業バーチャルライバー1名の紹介）

詳細仕様は docs/spec.md を参照すること。特に「権利・ガイドライン」の節は必ず守る。

## 技術構成
- Astro（静的サイト。DBは使わない）
- サーバー側の処理は「配信中判定」だけ：Cloudflare Worker（Cron Trigger）＋KV、サイトからは /api/live で読む
  - 静的配信・/api/live・Cron はサイトと同じ1つの Worker にまとめる
- アニメーション：GSAP（ScrollTrigger）、CSS、Astro View Transitions。HOME のエフェクトは CSS 中心（必要なら軽量な Canvas）
- 公開先：Cloudflare Workers（静的アセット配信。GitHub 連携で push 時に自動デプロイ、設定は wrangler.jsonc）
- お問い合わせは外部フォームへのリンクで案内（埋め込み・自前の送信処理は作らない）
- リポジトリ：REN_HP（このディレクトリ直下が Astro プロジェクトのルート）

## ページ
HOME / ABOUT / NEWS / HISTORY / ACHIEVEMENTS / CONTACT
- プライバシーポリシーは独立ページにせず、CONTACT 内の節（/contact/#privacy）に置く
- HISTORY の項目が実績に紐づく場合は /achievements/#ID へリンクし、そのモーダルを開く

## データ管理
- NEWS：src/content/news/ の Markdown（1記事1ファイル、前書きは title / date / category。分類はカテゴリのみ）
- サイト名・非公式表記：src/data/site.yaml
- ライバーのプロフィール（衣装・SNS・タグ・記念日・よくやる配信）：src/data/profile.yaml
- HISTORY / ACHIEVEMENTS / クレジット：src/data/ の YAML
- 立ち絵（衣装・差分）：src/assets/outfits/（Astro の Image で最適化）
- その他の静的ファイル：public/
- 共通レイアウト：src/layouts/BaseLayout.astro
- 本番素材が揃うまではダミーデータ・仮素材で進める

## 権利・ガイドライン（必須）
- 非公式ファンサイト。サイト名・ドメインに「公式」「official」などを使わない
- フッターに「非公式ファンサイトであり、事務所・ライバー本人とは関係ありません」と明記
- 公式画像・ロゴは一切使わない（トレース・加工も不可）。立ち絵・背景は絵師に依頼したイラストのみ
- 公式の紹介文は引用しない（自作の文章＋公式プロフィールへのリンク）
- 広告・アフィリエイト・投げ銭など収益になるものを置かない
- 他のライバー・主催者は公開SNSへのリンクのみ（画像は載せない）
- SNS はアイコン付きの通常リンク（埋め込みウィジェットは使わない）

## ルール
- ライブラリは npm で導入し、CDN は使わない
- prefers-reduced-motion ではアニメーションを止める（HOME は静止画のみ。HISTORY は初期値を縦にし、横を選んだ場合も GSAP を使わず通常の横スクロール）
- フッターの SNS はライバー本人の SNS（profile.yaml）
- スマホ表示にも対応する（スマホでは重い演出を簡易版に）
- HOME に初期ロード演出は入れない
- 配信の埋め込みはクリックで読み込む（YouTube は youtube-nocookie.com、Twitch は parent に公開先ドメイン）
- View Transitions 使用時は GSAP / ScrollTrigger をページ遷移ごとに破棄・再初期化する
- 多言語対応（英語・中国語）は後日検討。今は日本語のみで作る
- APIキーなどの秘密情報はコードに書かない（Worker のシークレットで管理）
- コメントと説明は日本語で

## コマンド
- 開発サーバー：npm run dev
- ビルド確認：npm run build
