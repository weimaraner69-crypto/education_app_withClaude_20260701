import { describe, expect, it } from 'vitest';
import { figureLabel } from './figureLabel';

describe('figureLabel', () => {
  it('図形の種類に応じた読み上げ用の説明を返す', () => {
    expect(figureLabel({ kind: 'circle', params: { radius: 5 } })).toBe('半径 5cm の円');
    expect(figureLabel({ kind: 'line-graph', params: { slope: 2, intercept: 1 } })).toBe(
      '一次関数のグラフ',
    );
    expect(figureLabel({ kind: 'symmetry-polygon', params: { sides: 4 } })).toBe(
      '正4角形と対称の軸',
    );
  });
});
