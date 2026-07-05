import type { Answer } from '../types/problem';

// 採点の共通処理（仕様書4-2「こたえの型」）。
// 子供が入力した文字列が、問題の正解と合っているかを判定する。
// テンプレート方式でもAI方式でも、問題は同じ Answer の形で来るので、採点もここ1か所で済む。

/**
 * 入力（文字列）が正解かどうかを返す。
 * 今は number（数字ひとつ）と divmod（しょう・あまり）に対応。
 * choice / text は将来のAI文章問題・記述式で使うので、今は未対応（false）。
 */
export function checkAnswer(answer: Answer, input: string): boolean {
  const trimmed = input.trim();
  if (trimmed === '') return false;

  switch (answer.format) {
    case 'number': {
      const n = Number(trimmed);
      if (Number.isNaN(n)) return false;
      // 3.14 のかけ算などで出る小数のわずかな誤差を許すため、ごく小さい範囲で一致を見る
      return Math.abs(n - answer.value) < 0.001;
    }
    case 'divmod': {
      // 「5 あまり 2」「5あまり2」「5 2」など、数字を2つ拾って比べる
      const nums = trimmed.match(/-?\d+/g);
      if (!nums || nums.length < 2) return false;
      return Number(nums[0]) === answer.quotient && Number(nums[1]) === answer.remainder;
    }
    default:
      // choice / text は将来対応
      return false;
  }
}
