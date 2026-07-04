import type { Problem } from '../../types/problem';
import { randomInt, type Rng } from '../../lib/rng';
import type { TemplateGenerator } from './types';

/**
 * かけ算（九九）のテンプレート。土台の動作確認用（PLAN タスク2-3）。
 * 数字はコードがランダムに入れ、答えもコードが掛け算するので必ず正しい。
 * ヒントは「a×b を a×(b-1) に a をたす形」で自動生成する（仕様書4-1a）。
 */
export const multiplicationTemplate: TemplateGenerator = {
  key: 'mul',
  subjectId: 'math',
  gradeId: 'g-elem',
  unitId: 'multiplication',
  generate(rng?: Rng): Problem {
    const a = randomInt(2, 9, rng);
    const b = randomInt(2, 9, rng);
    const product = a * b;
    const oneLess = a * (b - 1);

    const hints: Problem['hints'] = [
      `${a} を何回たせばいいか、考えてみよう。`,
      `${a} × ${b} は、${a} × ${b - 1}（＝${oneLess}）に、もう1回 ${a} をたすと出るよ。`,
      `${oneLess} に ${a} をたすと？`,
    ];

    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt: `${a} × ${b} = ?`,
      answer: { format: 'number', value: product },
      hints,
      explanation: `${a} × ${b} は、${a} を ${b} 回たした数だよ。`,
      difficulty: 1,
    };
  },
};
