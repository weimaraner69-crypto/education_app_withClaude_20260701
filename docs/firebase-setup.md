# Firebase 接続の準備

学習記録の保存機能は実装済みです。Firebase プロジェクトを作成して接続すると、解答ごとに
`attempts`（解答記録）の箱へ保存されます。

## 接続手順

1. [Firebase コンソール](https://console.firebase.google.com/) でプロジェクトを作成する。
2. 「ウェブアプリを追加」から設定値を表示する。
3. リポジトリ直下で `.env.example` を `.env` にコピーし、表示された値を貼り付ける。
   `VITE_FIREBASE_PROJECT_ID` は `educationappwithcodex20260710` を初期値として入れてある。
4. Firebase コンソールで Cloud Firestore を有効にする。
5. Firebase Authentication の「ログイン方法」で **匿名** を有効にする。
6. 次のコマンドで、このリポジトリの安全ルールをFirebaseへ反映する。

   ```bash
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules --project educationappwithcodex20260710
   ```

7. 開発サーバーを再起動し、子供としてログインして問題を1問解く。
8. Firestore の `attempts` に、`userId`、`ownerUid`、`unitId`、`isCorrect`、`timeTakenMs`、
   `hintsUsedCount`、`answeredAt` が作られたことを確認する。

`.env` は接続設定を含むローカル専用ファイルです。Gitには追加しません。

## 安全に公開する前に

現在の子供の名前選択は、Firebase接続前でも試せる仮ログインです。記録を保存するときは、
Firebase Authentication の匿名アカウントを自動で作り、端末ごとの `ownerUid` で Firestore の
記録を保護します。

この仕組みは「ほかの端末から記録を読んだり書いたりできない」ことを守る最初の段階です。
複数端末の学習記録を保護者がまとめて見る公開版では、子供ごとのFirebaseアカウントと、
保護者の閲覧権限を追加してから公開します。

接続確認だけのために、誰でも読み書きできるルールを公開環境へ設定しないでください。
