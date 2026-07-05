import type { Unit } from '../../types/unit';

// 仮の単元データ（Firebase 接続前の“動く単元えらび画面”用）。
// Firestore の units コレクションを作ったら、ここは読み込み処理に置き換える。
//
// 中身は PLAN 4-1 で決めた単元（2026/07/04 決定）に合わせている。
//   小6：分数のかけ算・わり算／比・比の利用／円の面積／場合の数・対称な図形
//   中2：連立方程式／一次関数／式の計算／確率
// ※小6は「＋1単元」を検討中。決まったらここに1行足す。
const SUBJECT_MATH = 'math'; // 算数・数学

export const SEED_UNITS: Unit[] = [
  // ---- 小6（算数） ----
  {
    id: 'elem6-fraction-muldiv',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-elem6',
    name: '分数のかけ算・わり算',
    order: 1,
    icon: '🍰',
  },
  {
    id: 'elem6-ratio',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-elem6',
    name: '比・比の利用',
    order: 2,
    icon: '⚖️',
  },
  {
    id: 'elem6-circle-area',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-elem6',
    name: '円の面積',
    order: 3,
    icon: '⭕',
    generatorKey: 'circle-area', // この単元はテンプレートで出題できる（タスク2-3）
  },
  {
    id: 'elem6-cases-symmetry',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-elem6',
    name: '場合の数・対称な図形',
    order: 4,
    icon: '🔷',
  },
  // ---- 中2（数学） ----
  {
    id: 'jhs2-simultaneous-eq',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-jhs2',
    name: '連立方程式',
    order: 1,
    icon: '🧮',
  },
  {
    id: 'jhs2-linear-function',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-jhs2',
    name: '一次関数',
    order: 2,
    icon: '📈',
  },
  {
    id: 'jhs2-expression-calc',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-jhs2',
    name: '式の計算',
    order: 3,
    icon: '➗',
  },
  {
    id: 'jhs2-probability',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-jhs2',
    name: '確率',
    order: 4,
    icon: '🎲',
  },
];

/**
 * 指定した学年の単元だけを、order（並び順）の小さい順に取り出す。
 * ログインした子供の学年に応じて単元を出し分けるために使う（仕様書5章のP0機能）。
 */
export function unitsForGrade(gradeId: string | undefined): Unit[] {
  if (!gradeId) return [];
  return SEED_UNITS.filter((u) => u.gradeId === gradeId).sort((a, b) => a.order - b.order);
}
