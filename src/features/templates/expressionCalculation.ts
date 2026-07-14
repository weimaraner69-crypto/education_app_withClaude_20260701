import type { Problem } from '../../types/problem';
import { randomInt, type Rng } from '../../lib/rng';
import type { TemplateGenerator } from './types';

// 式の計算（中2）のテンプレート。
// 文字 a が同じ項だけをまとめ、係数のたし算・ひき算に集中できる問題にする。
export const expressionCalculationTemplate: TemplateGenerator = {
  key: 'expression-calculation',
  subjectId: 'math',
  gradeId: 'g-jhs2',
  unitId: 'jhs2-expression-calc',
  generate(rng?: Rng): Problem {
    const first = randomInt(2, 7, rng);
    const second = randomInt(2, 7, rng);
    const third = randomInt(1, first + second - 1, rng);
    const answer = first + second - third;

    const hints: Problem['hints'] = [
      'a が付いた項どうしは、係数（前の数）だけを計算してまとめられるよ。',
      `${first} + ${second} - ${third} を計算しよう。`,
      `係数は ${answer}。□ に入る数は？`,
    ];

    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt: `${first}a + ${second}a - ${third}a = □a（□にあてはまる数は？）`,
      answer: { format: 'number', value: answer },
      hints,
      explanation: `${first}a + ${second}a - ${third}a = (${first} + ${second} - ${third})a = ${answer}a。だから □ は ${answer} だよ。`,
      difficulty: 2,
    };
  },
};
