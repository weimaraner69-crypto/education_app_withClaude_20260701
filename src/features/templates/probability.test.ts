import { describe, expect, it } from 'vitest';
import { probabilityTemplate } from './probability';

describe('probabilityTemplate', () => {
  function sequenceRng(values: number[]): () => number {
    let index = 0;
    return () => values[index++];
  }

  it('赤2個、青4個なら、赤を引く確率を 1/3 として作る', () => {
    const problem = probabilityTemplate.generate(sequenceRng([0.2, 0.7]));

    expect(problem.prompt).toContain('赤玉が 2 個、青玉が 4 個');
    expect(problem.answer).toEqual({ format: 'fraction', numerator: 1, denominator: 3 });
  });

  it('ヒントを3段階もつ', () => {
    const problem = probabilityTemplate.generate(sequenceRng([0.2, 0.7]));

    expect(problem.hints).toHaveLength(3);
  });
});
