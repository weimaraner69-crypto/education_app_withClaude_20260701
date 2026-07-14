import { describe, expect, it } from 'vitest';
import { fractionMulDivTemplate } from './fractionMulDiv';

describe('fractionMulDivTemplate', () => {
  function sequenceRng(values: number[]): () => number {
    let index = 0;
    return () => values[index++];
  }

  it('3/4 × 2/3 = 1/2 を正しく作る', () => {
    const problem = fractionMulDivTemplate.generate(sequenceRng([0.0, 0.3, 0.3, 0.2, 0.2]));

    expect(problem.prompt).toContain('3/4 × 2/3');
    expect(problem.answer).toEqual({ format: 'fraction', numerator: 1, denominator: 2 });
  });

  it('3/4 ÷ 2/3 = 9/8 を正しく作る', () => {
    const problem = fractionMulDivTemplate.generate(sequenceRng([0.9, 0.3, 0.3, 0.2, 0.2]));

    expect(problem.prompt).toContain('3/4 ÷ 2/3');
    expect(problem.answer).toEqual({ format: 'fraction', numerator: 9, denominator: 8 });
  });

  it('ヒントを3段階もつ', () => {
    const problem = fractionMulDivTemplate.generate(sequenceRng([0.0, 0.3, 0.3, 0.2, 0.2]));

    expect(problem.hints).toHaveLength(3);
  });
});
