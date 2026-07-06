import { describe, expect, it } from 'vitest';
import { ratioTemplate } from './ratio';

// 比のテンプレートの自動テスト（CLAUDE.md：答えを計算するロジックには必ずテスト）。
// rng（乱数）を順番に固定して、比と答えが必ず正しくなることを確かめる。
describe('ratioTemplate', () => {
  // randomInt(min, max, rng) = floor(rng()*(max-min+1)) + min。
  // p=randomInt(2,6), q=randomInt(2,9), k=randomInt(2,5) の順に呼ばれる。
  // 0.1→p=2、0.6→q=6、0.4→k=3 になる。
  function sequenceRng(values: number[]): () => number {
    let i = 0;
    return () => values[i++];
  }

  it('2 : 6 = 6 : □ → □ は 18（同じ比を正しく計算）', () => {
    const p = ratioTemplate.generate(sequenceRng([0.1, 0.6, 0.4]));
    expect(p.prompt).toContain('2 : 6 = 6 :');
    expect(p.answer).toEqual({ format: 'number', value: 18 });
  });

  it('ヒントを3段階もつ', () => {
    const p = ratioTemplate.generate(sequenceRng([0.1, 0.6, 0.4]));
    expect(p.hints).toHaveLength(3);
  });
});
