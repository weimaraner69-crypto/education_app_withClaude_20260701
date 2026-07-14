import type { Problem } from '../../types/problem';
import { randomInt, type Rng } from '../../lib/rng';
import type { TemplateGenerator } from './types';

// 一次関数のテンプレート（中2／PLAN タスク2-4）。
// y = ax + b に x の値を代入して、y の値を求める。係数・答えに負の数も出る。
// 答えはコードが計算するので必ず正しい。ヒントも自動生成（仕様書4-1a）。

// 「ax」の部分の文字列を作る（1x→x、-1x→-x）。
function formatAx(a: number): string {
  if (a === 1) return 'x';
  if (a === -1) return '-x';
  return `${a}x`;
}

// 「+ b」「- b」の部分の文字列を作る（b=0 のときは何も出さない）。
function formatB(b: number): string {
  if (b > 0) return ` + ${b}`;
  if (b < 0) return ` - ${-b}`;
  return '';
}

export const linearFunctionTemplate: TemplateGenerator = {
  key: 'linear-function',
  subjectId: 'math',
  gradeId: 'g-jhs2', // 中2
  unitId: 'jhs2-linear-function',
  generate(rng?: Rng): Problem {
    // 係数 a は 0 を避ける（±1〜5）。b は -9〜9（0もあり）。x は 0 を避ける（±1〜5）。
    const a = randomInt(1, 5, rng) * (randomInt(0, 1, rng) === 0 ? 1 : -1);
    const b = randomInt(-9, 9, rng);
    const x = randomInt(1, 5, rng) * (randomInt(0, 1, rng) === 0 ? 1 : -1);
    const y = a * x + b;

    const expr = `y = ${formatAx(a)}${formatB(b)}`;
    // b を「たす／ひく」の言い回し（ヒント2用）。b=0 のときも自然な一文になるようにする。
    const bStep =
      b > 0
        ? `その数に ${b} をたそう`
        : b < 0
          ? `その数から ${-b} をひこう`
          : 'その数がそのまま答えだよ';

    const hints: Problem['hints'] = [
      `x のところに ${x} を入れて計算するよ。`,
      `${a} × (${x}) = ${a * x}。${bStep}。`,
      `${a * x}${formatB(b)} は？`,
    ];

    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt: `${expr} で、x = ${x} のときの y の値は？`,
      figure: { kind: 'line-graph', params: { slope: a, intercept: b } },
      answer: { format: 'number', value: y },
      hints,
      explanation: `${expr} に x = ${x} を入れると、${a} × (${x})${formatB(b)} = ${y} だよ。`,
      difficulty: 3,
      allowNegativeInput: true, // 答えが負になりうるので、± ボタンを出す
    };
  },
};
