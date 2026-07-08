// こたえ入力の「マイナス符号」まわりの共通処理（出題画面の「±」ボタン用）。
// 半角 - ／全角 － (U+FF0D) ／マイナス記号 − (U+2212) の3種類と、
// うっかり入った先頭の空白をまとめて扱い、± ボタン・採点・表示でズレないようにする。
// 画面（QuizScreen）から切り出しておくことで、エッジケースを自動テストで確かめられる。

// 先頭のマイナス（3種類）にマッチする。判定は「先頭空白を除いたあと」に行う。
const LEADING_MINUS = /^[-－−]/;

/** 入力の先頭（空白を除く）にマイナスが付いているか。 */
export function hasLeadingMinus(input: string): boolean {
  return LEADING_MINUS.test(input.trimStart());
}

/**
 * 先頭のマイナスを付けたり外したりする（± ボタン用）。
 * ・先頭の空白は取り除く（" 5" → "5" のまま "-5" にできるように）
 * ・全角／記号のマイナスも外せる（"－5" → "5"）
 * ・付けるときは半角の - にそろえる（採点と食い違わないように）
 */
export function toggleLeadingSign(input: string): string {
  const trimmed = input.trimStart();
  return LEADING_MINUS.test(trimmed) ? trimmed.replace(LEADING_MINUS, '') : `-${trimmed}`;
}
