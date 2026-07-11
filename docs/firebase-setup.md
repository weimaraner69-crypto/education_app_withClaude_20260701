# Firebase 接続の準備

学習記録の保存機能は実装済みです。Firebase プロジェクトを作成して接続すると、解答ごとに
`attempts`（解答記録）の箱へ保存されます。

## 接続手順

1. [Firebase コンソール](https://console.firebase.google.com/) でプロジェクトを作成する。
2. 「ウェブアプリを追加」から設定値を表示する。
3. リポジトリ直下で `.env.example` を `.env` にコピーし、表示された6つの値を貼り付ける。
4. Firebase コンソールで Cloud Firestore を有効にする。
5. 開発サーバーを再起動し、子供としてログインして問題を1問解く。
6. Firestore の `attempts` に、`userId`、`unitId`、`isCorrect`、`timeTakenMs`、
   `hintsUsedCount`、`answeredAt` が作られたことを確認する。

`.env` は接続設定を含むローカル専用ファイルです。Gitには追加しません。

## 安全に公開する前に

現在のログインは、Firebase接続前でも試せる仮ログインです。Firestore の利用者を安全に
識別する仕組みではありません。そのため、実際の子供の記録をオンラインに保存して公開する前に、
Firebase Authentication と、それに対応する Firestore セキュリティルールを追加します。

接続確認だけのために、誰でも読み書きできるルールを公開環境へ設定しないでください。
