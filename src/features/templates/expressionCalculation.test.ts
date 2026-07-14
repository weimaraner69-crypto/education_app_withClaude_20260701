import { describe, expect, it } from 'vitest';
import { expressionCalculationTemplate } from './expressionCalculation';

describe('expressionCalculationTemplate', () => {
  function sequenceRng(values: number[]): () => number {
    let index = 0;
    return () => values[index++];
  }

  it('3a + 5a - 2a = □a の答えを 6 として作る', () => {
    const problem = expressionCalculationTemplate.generate(sequenceRng([0.2, 0.6, 0.2]));

    expect(problem.prompt).toBe('3a + 5a - 2a = □a（□にあてはまる数は？）');
    expect(problem.answer).toEqual({ format: 'number', value: 6 });
  });

  it('ヒントを3段階もつ', () => {
    const problem = expressionCalculationTemplate.generate(sequenceRng([0.2, 0.6, 0.2]));

    expect(problem.hints).toHaveLength(3);
  });
});
