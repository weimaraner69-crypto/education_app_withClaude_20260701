import type { Problem } from '../../types/problem';
import { randomInt, type Rng } from '../../lib/rng';
import type { TemplateGenerator } from './types';

function formatTerm(coefficient: number, variable: string): string {
  return coefficient === 1 ? variable : `${coefficient}${variable}`;
}

// 連立方程式（中2）のテンプレート。
// 先に整数の x、y を決めてから式を組み立てるため、答えが小数になったり矛盾したりしない。
export const simultaneousEquationTemplate: TemplateGenerator = {
  key: 'simultaneous-equation',
  subjectId: 'math',
  gradeId: 'g-jhs2',
  unitId: 'jhs2-simultaneous-eq',
  generate(rng?: Rng): Problem {
    const x = randomInt(1, 8, rng);
    const y = randomInt(1, 8, rng);
    const a = randomInt(1, 3, rng);
    const b = randomInt(1, 3, rng);
    const firstResult = a * x + b * y;
    const secondResult = b * x - a * y;

    const hints: Problem['hints'] = [
      '2つの式を足したり引いたりして、x か y のどちらかを消してみよう。',
      '係数をそろえて一方の文字を消すと、もう一方の文字だけの式になるよ。',
      '片方の値が出たら、元の式に入れて、もう片方の値も求めよう。',
    ];

    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt: `${formatTerm(a, 'x')} + ${formatTerm(b, 'y')} = ${firstResult}\n${formatTerm(b, 'x')} - ${formatTerm(a, 'y')} = ${secondResult}\nx と y は？（x, y の順に入力）`,
      answer: { format: 'pair', values: [x, y], labels: ['x', 'y'] },
      hints,
      explanation: `2つの式を使うと、x = ${x}、y = ${y} になるよ。`,
      difficulty: 3,
    };
  },
};
