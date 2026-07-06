import type { Problem } from '../../types/problem';
import { randomInt, type Rng } from '../../lib/rng';
import type { TemplateGenerator } from './types';

// 比・比の利用のテンプレート（小6／PLAN タスク2-4）。
// 「p : q = (p×k) : □」の形で出題し、同じ比になる □ を求めさせる。
// 左の p が p×k に「何倍になったか（＝k倍）」を見つけ、q も同じ k 倍する、という考え方。
// 数字はすべて正の整数なので、答えの入力もシンプル。
export const ratioTemplate: TemplateGenerator = {
  key: 'ratio',
  subjectId: 'math',
  gradeId: 'g-elem6', // 小6
  unitId: 'elem6-ratio',
  generate(rng?: Rng): Problem {
    const p = randomInt(2, 6, rng); // 左の比の前の数
    const q = randomInt(2, 9, rng); // 左の比の後ろの数
    const k = randomInt(2, 5, rng); // 何倍にするか
    const rightFirst = p * k; // 右の比の前の数
    const answer = q * k; // 求める □（右の比の後ろの数）

    const hints: Problem['hints'] = [
      `左の ${p} が ${rightFirst} に、何倍になったか考えてみよう。`,
      `${p} × ${k} = ${rightFirst} だから ${k} 倍だね。${q} も同じ ${k} 倍しよう。`,
      `${q} × ${k} は？`,
    ];

    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt: `${p} : ${q} = ${rightFirst} : □（□にあてはまる数は？）`,
      answer: { format: 'number', value: answer },
      hints,
      explanation: `${p} : ${q} の両方を ${k} 倍すると ${rightFirst} : ${answer}。だから □ は ${answer} だよ。`,
      difficulty: 2,
    };
  },
};
