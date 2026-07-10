import type { Answer } from '../types/problem';

// 採点の共通処理（仕様書4-2「こたえの型」）。
// 子供が入力した文字列が、問題の正解と合っているかを判定する。
// テンプレート方式でもAI方式でも、問題は同じ Answer の形で来るので、採点もここ1か所で済む。

// 全角で入力された数字・記号を半角に直す。
// 子供が日本語入力（IME）のまま打つと「７８．５」のように全角になりやすく、
// そのままでは数値に変換できず、正解でも不正解になってしまう。採点の前にそろえておく。
function toHalfWidthNumber(input: string): string {
  return input
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xff10 + 0x30)) // 全角数字
    .replace(/．/g, '.') // 全角ピリオド
    .replace(/[－−]/g, '-') // 全角マイナス（－）・マイナス記号（−）を半角 - に
    .replace(/／/g, '/') // 全角スラッシュ（分数）
    .replace(/[，、]/g, ','); // 全角カンマ・読点（x,y のような2つの答え）
  // 全角スペースは trim() が除去し、divmod の数字抽出も途中の空白を無視するので変換不要。
}

function isEquivalentFraction(
  numerator: number,
  denominator: number,
  answerNumerator: number,
  answerDenominator: number,
): boolean {
  if (denominator === 0) return false;
  return numerator * answerDenominator === answerNumerator * denominator;
}

/**
 * 入力（文字列）が正解かどうかを返す。
 * 今は number（数字ひとつ）と divmod（しょう・あまり）に対応。
 * choice / text は将来のAI文章問題・記述式で使うので、今は未対応（false）。
 */
export function checkAnswer(answer: Answer, input: string): boolean {
  const normalized = toHalfWidthNumber(input).trim();
  if (normalized === '') return false;

  switch (answer.format) {
    case 'number': {
      const n = Number(normalized);
      if (Number.isNaN(n)) return false;
      // 3.14 のかけ算などで出る小数の“ごくわずかな計算誤差”だけを許し、
      // 実際に違う数字（例: 12.56 と 12.561）はきちんと不正解にする。
      return Math.abs(n - answer.value) < 1e-6;
    }
    case 'divmod': {
      // 「5 あまり 2」「5あまり2」「5 2」など、数字を拾って比べる。
      // 余分な数字が混じった入力（例: 「5 あまり 2 999」）を正解にしないよう、
      // 数字がちょうど2つのときだけ判定する。
      const nums = normalized.match(/-?\d+/g);
      if (!nums || nums.length !== 2) return false;
      return Number(nums[0]) === answer.quotient && Number(nums[1]) === answer.remainder;
    }
    case 'fraction': {
      // 既約分数だけでなく、2/4 のような同じ値の分数も正解にする。
      // 答えが整数になる問題では、2 と入力しても 2/1 とみなして判定する。
      const fractionMatch = normalized.match(/^(-?\d+)(?:\s*\/\s*(-?\d+))?$/);
      if (!fractionMatch) return false;
      const numerator = Number(fractionMatch[1]);
      const denominator = fractionMatch[2] === undefined ? 1 : Number(fractionMatch[2]);
      return isEquivalentFraction(numerator, denominator, answer.numerator, answer.denominator);
    }
    case 'pair': {
      // 「x=2, y=3」「2, 3」のどちらも、数がちょうど2つなら受け付ける。
      // 余分な数を含む入力は正解にしないので、答えの取り違えを防げる。
      const nums = normalized.match(/-?\d+/g);
      if (!nums || nums.length !== 2) return false;
      return Number(nums[0]) === answer.values[0] && Number(nums[1]) === answer.values[1];
    }
    case 'choice':
      return normalized === String(answer.correctIndex);
    default:
      // text は将来対応
      return false;
  }
}
