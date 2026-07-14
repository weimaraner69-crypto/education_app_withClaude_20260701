import type { Problem } from '../../types/problem';
import { randomInt, type Rng } from '../../lib/rng';
import type { TemplateGenerator } from './types';

function greatestCommonDivisor(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    [x, y] = [y, x % y];
  }

  return x;
}

function reduceFraction(
  numerator: number,
  denominator: number,
): { numerator: number; denominator: number } {
  const divisor = greatestCommonDivisor(numerator, denominator);
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}

function formatFraction(numerator: number, denominator: number): string {
  return denominator === 1 ? String(numerator) : `${numerator}/${denominator}`;
}

// 分数のかけ算・わり算（小6）のテンプレート。
// わり算は「わる数の分子と分母をひっくり返して、かけ算にする」考え方で解ける形にする。
export const fractionMulDivTemplate: TemplateGenerator = {
  key: 'fraction-muldiv',
  subjectId: 'math',
  gradeId: 'g-elem6',
  unitId: 'elem6-fraction-muldiv',
  generate(rng?: Rng): Problem {
    const isDivision = randomInt(0, 1, rng) === 1;
    const firstNumerator = randomInt(1, 8, rng);
    const firstDenominator = randomInt(2, 9, rng);
    const secondNumerator = randomInt(1, 8, rng);
    const secondDenominator = randomInt(2, 9, rng);
    const rawNumerator = isDivision
      ? firstNumerator * secondDenominator
      : firstNumerator * secondNumerator;
    const rawDenominator = isDivision
      ? firstDenominator * secondNumerator
      : firstDenominator * secondDenominator;
    const answer = reduceFraction(rawNumerator, rawDenominator);
    const operator = isDivision ? '÷' : '×';
    const calculation = isDivision
      ? `${firstNumerator}/${firstDenominator} × ${secondDenominator}/${secondNumerator}`
      : `${firstNumerator}/${firstDenominator} × ${secondNumerator}/${secondDenominator}`;

    const hints: Problem['hints'] = isDivision
      ? [
          '分数でわるときは、わる数をひっくり返してかけ算にするよ。',
          `${secondNumerator}/${secondDenominator} をひっくり返すと ${secondDenominator}/${secondNumerator}。`,
          `${calculation} を計算して、分数の形で答えよう。`,
        ]
      : [
          '分数どうしのかけ算は、分子どうし・分母どうしをそれぞれかけるよ。',
          `分子は ${firstNumerator} × ${secondNumerator}、分母は ${firstDenominator} × ${secondDenominator}。`,
          `${calculation} を計算して、分数の形で答えよう。`,
        ];

    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt: `${firstNumerator}/${firstDenominator} ${operator} ${secondNumerator}/${secondDenominator} = ?（分数で答えよう）`,
      answer: { format: 'fraction', ...answer },
      hints,
      explanation: `${calculation} = ${formatFraction(answer.numerator, answer.denominator)}。だから答えは ${formatFraction(answer.numerator, answer.denominator)} だよ。`,
      difficulty: 3,
    };
  },
};
