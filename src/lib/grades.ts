// 学年マスタ（仕様書6-1 grades）。
// 「小1〜高3まで枠を広めに」という方針だが、今は実際に使う小6・中2だけを定義しておく。
// 学年を増やすときは、この配列に1行足すだけでよい。

export interface Grade {
  id: string; // 学年ID（例: 'g-elem6'）
  label: string; // 画面に出す短い表示（例: '小6'）
}

export const GRADES: Grade[] = [
  { id: 'g-elem6', label: '小6' },
  { id: 'g-jhs2', label: '中2' },
];

/** 学年IDから表示名（'小6' など）を引く。未知のIDや未指定なら空文字を返す。 */
export function gradeLabel(gradeId: string | undefined): string {
  if (!gradeId) return '';
  return GRADES.find((g) => g.id === gradeId)?.label ?? '';
}
