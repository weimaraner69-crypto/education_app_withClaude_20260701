import { describe, expect, it } from 'vitest';
import { linearFunctionTemplate } from './linearFunction';

// 一次関数テンプレートの自動テスト（CLAUDE.md：答えを計算するロジックには必ずテスト）。
// rng を順番に固定して、係数・代入・答え（負の数も）が正しくなることを確かめる。
// 呼ばれる順番：aの大きさ→aの符号→b→xの大きさ→xの符号。
describe('linearFunctionTemplate', () => {
  function sequenceRng(values: number[]): () => number {
    let i = 0;
    return () => values[i++];
  }

  it('y = 2x - 3, x = 4 → y = 5（正の答え）', () => {
    const p = linearFunctionTemplate.generate(sequenceRng([0.2, 0.0, 0.33, 0.6, 0.0]));
    expect(p.prompt).toContain('y = 2x - 3');
    expect(p.prompt).toContain('x = 4');
    expect(p.answer).toEqual({ format: 'number', value: 5 });
    expect(p.allowNegativeInput).toBe(true);
  });

  it('y = -2x + 1, x = 3 → y = -5（負の答えも正しい）', () => {
    const p = linearFunctionTemplate.generate(sequenceRng([0.2, 0.9, 0.53, 0.4, 0.0]));
    expect(p.prompt).toContain('y = -2x + 1');
    expect(p.answer).toEqual({ format: 'number', value: -5 });
  });

  it('ヒントを3段階もつ', () => {
    const p = linearFunctionTemplate.generate(sequenceRng([0.2, 0.0, 0.33, 0.6, 0.0]));
    expect(p.hints).toHaveLength(3);
  });
});
