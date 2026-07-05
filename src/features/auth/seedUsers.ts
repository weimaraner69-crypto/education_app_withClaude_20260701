import type { AppUser } from '../../types/user';

// 仮の利用者データ（Firebase 接続前の“動くログイン画面”用）。
// Firestore の users コレクションを作ったら、ここは読み込み処理に置き換える。
//
// 名前・アイコンはサンプルです。英理究さんが実際のお子さんの名前・好きな
// アイコンに書き換えてください（表示するだけの値なので、変えても他に影響しません）。
//
// 保護者PINの初期値は「1234」。下の parentPinHash は "1234" を SHA-256 で
// ハッシュにした値です（pin.ts 参照）。PINを変える機能は、あとのタスクで作ります。
const PARENT_PIN_HASH_1234 = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4';

export const SEED_USERS: AppUser[] = [
  {
    id: 'child-son',
    displayName: 'たろう',
    avatar: '🦖',
    role: 'child',
    gradeId: 'g-elem6', // 小6
  },
  {
    id: 'child-daughter',
    displayName: 'はなこ',
    avatar: '🐱',
    role: 'child',
    gradeId: 'g-jhs2', // 中2
  },
  {
    id: 'parent',
    displayName: 'おうちのひと',
    avatar: '🔑',
    role: 'parent',
    pinHash: PARENT_PIN_HASH_1234,
  },
];

/** ログイン画面に並べる子供の一覧（role が child のユーザー）。 */
export const SEED_CHILDREN: AppUser[] = SEED_USERS.filter((u) => u.role === 'child');

/** 保護者ユーザー（PIN照合に使う）。 */
export const SEED_PARENT: AppUser | undefined = SEED_USERS.find((u) => u.role === 'parent');
