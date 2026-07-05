// 仕様書6-2「users（子供・保護者）」に対応する型。
// 今はローカルの仮データ（seedUsers）で動かし、あとで Firestore の users コレクションに移す。
// そのときも、この型はそのまま使える（＝画面を作り直さなくて済む）。

/** 役割：子供（child）か保護者（parent）か（仕様書6-2） */
export type UserRole = 'child' | 'parent';

/** アプリの利用者ひとり分の情報 */
export interface AppUser {
  id: string; // ドキュメントID相当（例: 'child-son'）
  displayName: string; // 画面に出す名前（例: 'たろう'）
  avatar: string; // アイコン。今は絵文字ひと文字で表す（例: '🦖'）
  role: UserRole;
  gradeId?: string; // 子供の学年（例: 'g-elem6'）。保護者は持たない
  pinHash?: string; // 保護者のみ。暗証番号のハッシュ（平文は保存しない。pin.ts 参照）
}
