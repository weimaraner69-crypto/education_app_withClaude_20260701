// Firebase（データ保管庫）の初期化（仕様書6章）。
// 実際のキーは .env（gitignore対象・秘密情報）に置く。値は英理究さんが Firebase の
// プロジェクトを作ってから .env に貼り付ける（.env.example を参照）。
//
// 接続設定が未入力の開発中でも画面を使えるよう、初期化は「呼ばれたとき」だけ行う
// （getDb() を呼ぶまで接続しない）。
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

/** Firebase の設定値がすべて入力されているかを調べる。 */
export function isFirebaseConfigured(): boolean {
  return Object.values(firebaseConfig).every(Boolean);
}

/** Firestore（保管庫）への接続を返す。初回だけ初期化する。 */
export function getDb(): Firestore {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase の接続設定が未入力です。');
  }
  app ??= initializeApp(firebaseConfig);
  db ??= getFirestore(app);
  return db;
}
