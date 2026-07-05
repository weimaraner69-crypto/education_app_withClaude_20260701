import { describe, expect, it } from 'vitest';
import { circleAreaTemplate } from './circleArea';

// 円の面積テンプレートの自動テスト（CLAUDE.md：答えを計算するロジックには必ずテスト）。
// rng（乱数）を固定して、半径と答えが必ず正しくなることを確かめる。
describe('circleAreaTemplate', () => {
  // randomInt(1, 10, rng) = floor(rng() * 10) + 1 なので、
  // rng が 0.4 を返すと 半径 = floor(4) + 1 = 5 になる。
  const rngRadius5: () => number = () => 0.4;
  // rng が 0.2 を返すと 半径 = floor(2) + 1 = 3 になる（小数の答えの確認用）。
  const rngRadius3: () => number = () => 0.2;

  it('半径5cm → 面積 78.5、問題文と答えが一致する', () => {
    const p = circleAreaTemplate.generate(rngRadius5);
    expect(p.prompt).toContain('半径 5cm');
    expect(p.answer).toEqual({ format: 'number', value: 78.5 });
  });

  it('半径3cm → 面積 28.26（小数第2位まで正しく丸める）', () => {
    const p = circleAreaTemplate.generate(rngRadius3);
    expect(p.answer).toEqual({ format: 'number', value: 28.26 });
  });

  it('図データ（円・半径）とヒント3段階を持つ', () => {
    const p = circleAreaTemplate.generate(rngRadius5);
    expect(p.figure).toEqual({ kind: 'circle', params: { radius: 5 } });
    expect(p.hints).toHaveLength(3);
  });
});
