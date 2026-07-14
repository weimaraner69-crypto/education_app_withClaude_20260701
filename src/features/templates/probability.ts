import type { Problem } from '../../types/problem';
import { randomInt, type Rng } from '../../lib/rng';
import type { TemplateGenerator } from './types';

function greatestCommonDivisor(a: number, b: number): number {
  let x = a;
  let y = b;

  while (y !== 0) {
    [x, y] = [y, x % y];
  }

  return x;
}

// 確率（中2）のテンプレート。
// 赤玉と青玉の個数を先に決めてから「赤を引く確率」を計算するので、正解が必ず一致する。
export const probabilityTemplate: TemplateGenerator = {
  key: 'probability',
  subjectId: 'math',
  gradeId: 'g-jhs2',
  unitId: 'jhs2-probability',
  generate(rng?: Rng): Problem {
    const red = randomInt(1, 5, rng);
    const blue = randomInt(1, 5, rng);
    const total = red + blue;
    const divisor = greatestCommonDivisor(red, total);
    const numerator = red / divisor;
    const denominator = total / divisor;

    const hints: Problem['hints'] = [
      '確率は「起こってほしい場合の数 ÷ 全部の場合の数」で求めるよ。',
      `赤玉は ${red} 個、玉は全部で ${total} 個あるよ。`,
      `${red}/${total} を分数で答えよう。`,
    ];

    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt: `赤玉が ${red} 個、青玉が ${blue} 個入った袋から、玉を1個取り出す。赤玉を取り出す確率は？（分数で答えよう）`,
      answer: { format: 'fraction', numerator, denominator },
      hints,
      explanation: `赤玉は ${red} 個、全部で ${total} 個だから ${red}/${total}。約分すると ${numerator}/${denominator} だよ。`,
      difficulty: 2,
    };
  },
};
