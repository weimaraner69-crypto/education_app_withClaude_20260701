import type { Unit } from '../../types/unit';

// 仮の単元データ（Firebase 接続前の“動く単元えらび画面”用）。
// Firestore の units コレクションを作ったら、ここは読み込み処理に置き換える。
//
// 中身は PLAN 4-1 で決めた単元（2026/07/04 決定）に合わせている。
//   小6・中2：文部科学省の学習指導要領にある内容を、問題を作りやすい単元に分けている。
const SUBJECT_MATH = 'math'; // 算数・数学

export const SEED_UNITS: Unit[] = [
  // ---- 小6（算数） ----
  {
    id: 'elem6-letter-expression',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-elem6',
    name: '文字と式',
    order: 2,
    icon: '🔤',
    generatorKey: 'letter-expression',
  },
  {
    id: 'elem6-fraction-muldiv',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-elem6',
    name: '分数のかけ算・わり算',
    order: 1,
    icon: '🍰',
    generatorKey: 'fraction-muldiv', // この単元はテンプレートで出題できる（タスク2-4）
  },
  {
    id: 'elem6-ratio',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-elem6',
    name: '比・比の利用',
    order: 3,
    icon: '⚖️',
    generatorKey: 'ratio', // この単元はテンプレートで出題できる（タスク2-4）
  },
  {
    id: 'elem6-circle-area',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-elem6',
    name: '円の面積',
    order: 6,
    icon: '⭕',
    generatorKey: 'circle-area', // この単元はテンプレートで出題できる（タスク2-3）
  },
  {
    id: 'elem6-scale-drawing',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-elem6',
    name: '拡大図と縮図',
    order: 4,
    icon: '🔍',
    generatorKey: 'scale-drawing',
  },
  {
    id: 'elem6-symmetry',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-elem6',
    name: '対称な図形',
    order: 5,
    icon: '🪞',
    generatorKey: 'symmetry',
  },
  {
    id: 'elem6-approximate-area',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-elem6',
    name: 'およその面積',
    order: 7,
    icon: '🗺️',
    generatorKey: 'approximate-area',
  },
  {
    id: 'elem6-solid-volume',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-elem6',
    name: '角柱・円柱の体積',
    order: 8,
    icon: '🧊',
    generatorKey: 'solid-volume',
  },
  {
    id: 'elem6-proportional-inverse',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-elem6',
    name: '比例・反比例',
    order: 9,
    icon: '↔️',
    generatorKey: 'proportional-inverse',
  },
  {
    id: 'elem6-data',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-elem6',
    name: 'データの活用',
    order: 10,
    icon: '📊',
    generatorKey: 'elementary-data',
  },
  {
    id: 'elem6-cases',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-elem6',
    name: '場合の数',
    order: 11,
    icon: '🔢',
    generatorKey: 'cases',
  },
  // ---- 中2（数学） ----
  {
    id: 'jhs2-plane-geometry',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-jhs2',
    name: '平行線と角・多角形',
    order: 3,
    icon: '📐',
    generatorKey: 'plane-geometry',
  },
  {
    id: 'jhs2-congruence-proof',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-jhs2',
    name: '合同と証明',
    order: 4,
    icon: '📝',
    generatorKey: 'congruence-proof',
  },
  {
    id: 'jhs2-simultaneous-eq',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-jhs2',
    name: '連立方程式',
    order: 1,
    icon: '🧮',
    generatorKey: 'simultaneous-equation', // この単元はテンプレートで出題できる（タスク2-4）
  },
  {
    id: 'jhs2-linear-function',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-jhs2',
    name: '一次関数',
    order: 2,
    icon: '📈',
    generatorKey: 'linear-function', // この単元はテンプレートで出題できる（タスク2-4）
  },
  {
    id: 'jhs2-expression-calc',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-jhs2',
    name: '式の計算',
    order: 5,
    icon: '➗',
    generatorKey: 'expression-calculation', // この単元はテンプレートで出題できる（タスク2-4）
  },
  {
    id: 'jhs2-probability',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-jhs2',
    name: '確率',
    order: 7,
    icon: '🎲',
    generatorKey: 'probability', // この単元はテンプレートで出題できる（タスク2-4）
  },
  {
    id: 'jhs2-box-plot',
    subjectId: SUBJECT_MATH,
    gradeId: 'g-jhs2',
    name: 'データの分布・箱ひげ図',
    order: 6,
    icon: '📦',
    generatorKey: 'box-plot',
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
