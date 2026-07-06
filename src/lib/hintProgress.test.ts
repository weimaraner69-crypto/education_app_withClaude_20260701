import { describe, expect, it } from 'vitest';
import { hintProgress } from './hintProgress';

// 3段階ヒントの出し方の自動テスト（仕様書4-1a）。
describe('hintProgress', () => {
  it('まちがい0回：ヒントなし・正解は明かさない', () => {
    expect(hintProgress(0)).toEqual({ visibleHints: 0, reveal: false });
  });

  it('まちがい1〜3回：その回数ぶんヒントを見せる', () => {
    expect(hintProgress(1)).toEqual({ visibleHints: 1, reveal: false });
    expect(hintProgress(2)).toEqual({ visibleHints: 2, reveal: false });
    expect(hintProgress(3)).toEqual({ visibleHints: 3, reveal: false });
  });

  it('まちがい4回：ヒントは3段階のまま、正解を明かす', () => {
    expect(hintProgress(4)).toEqual({ visibleHints: 3, reveal: true });
  });

  it('5回以上でもヒントは3段階を超えない', () => {
    expect(hintProgress(10)).toEqual({ visibleHints: 3, reveal: true });
  });
});
