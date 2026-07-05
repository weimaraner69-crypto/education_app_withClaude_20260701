import type { Problem } from '../../types/problem';
import { randomInt, type Rng } from '../../lib/rng';
import type { TemplateGenerator } from './types';

// 円の面積のテンプレート（小6）。PLAN タスク2-3の最初の実テンプレート。
// 半径 r をランダムに決め、面積 = 半径 × 半径 × 円周率(3.14) を出題する。
// 答えはコードが計算するので必ず正しい。ヒントも自動生成する（仕様書4-1a）。
const PI = 3.14;

export const circleAreaTemplate: TemplateGenerator = {
  key: 'circle-area',
  subjectId: 'math',
  gradeId: 'g-elem6', // 小6
  unitId: 'elem6-circle-area',
  generate(rng?: Rng): Problem {
    const r = randomInt(1, 10, rng);
    const rSquared = r * r;
    // 3.14 のかけ算で出る小数の誤差を防ぐため、小数第2位までに丸める
    const area = Math.round(PI * rSquared * 100) / 100;

    const hints: Problem['hints'] = [
      '円の面積は「半径 × 半径 × 円周率」で求められるよ。',
      `半径は ${r}cm。まず ${r} × ${r} = ${rSquared} を計算しよう。`,
      `${rSquared} × 3.14 は？`,
    ];

    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt: `半径 ${r}cm の円の面積は？（円周率は 3.14）`,
      // 図のデータだけ持たせておく。実際に円を描くのはタスク2-6のSVG部品。
      figure: { kind: 'circle', params: { radius: r } },
      answer: { format: 'number', value: area },
      hints,
      explanation: `半径 × 半径 × 3.14 = ${r} × ${r} × 3.14 = ${area}（cm²）だよ。`,
      difficulty: 2,
    };
  },
};
