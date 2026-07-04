import { describe, it, expect } from 'vitest';
import { multiplicationTemplate } from './multiplication';

// 仕様書7-1「答えは必ず正しい」を、コードの面から自動で確認するテスト。
describe('かけ算テンプレート', () => {
  it('問題文の掛け算と answer.value が、100回試して必ず一致する', () => {
    for (let i = 0; i < 100; i++) {
      const p = multiplicationTemplate.generate();
      const match = p.prompt.match(/(\d+) × (\d+)/);
      expect(match).not.toBeNull();
      const a = Number(match![1]);
      const b = Number(match![2]);
      expect(p.answer).toEqual({ format: 'number', value: a * b });
    }
  });

  it('乱数を固定すると、いつも同じ問題（7 × 8 = 56）が出る', () => {
    // randomInt(2,9): floor(rng*8)+2。0.7→7、0.8→8 になる。
    const values = [0.7, 0.8];
    let i = 0;
    const fixedRng = () => values[i++];

    const p = multiplicationTemplate.generate(fixedRng);
    expect(p.prompt).toBe('7 × 8 = ?');
    expect(p.answer).toEqual({ format: 'number', value: 56 });
    expect(p.hints).toHaveLength(3);
  });
});
