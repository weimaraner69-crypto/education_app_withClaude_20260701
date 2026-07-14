import { describe, expect, it } from 'vitest';
import { simultaneousEquationTemplate } from './simultaneousEquation';

describe('simultaneousEquationTemplate', () => {
  function sequenceRng(values: number[]): () => number {
    let index = 0;
    return () => values[index++];
  }

  it('x=2、y=3 を答えとする連立方程式を正しく作る', () => {
    const problem = simultaneousEquationTemplate.generate(sequenceRng([0.2, 0.3, 0.0, 0.4]));

    expect(problem.prompt).toContain('x + 2y = 8');
    expect(problem.prompt).toContain('2x - y = 1');
    expect(problem.answer).toEqual({ format: 'pair', values: [2, 3], labels: ['x', 'y'] });
  });

  it('ヒントを3段階もつ', () => {
    const problem = simultaneousEquationTemplate.generate(sequenceRng([0.2, 0.3, 0.0, 0.4]));

    expect(problem.hints).toHaveLength(3);
  });
});
