import { describe, expect, it } from 'vitest';
import { unitsForGrade } from './seedUnits';

// 学年で単元を出し分けるロジックの自動テスト（仕様書5章のP0機能）。
describe('unitsForGrade', () => {
  it('小6（g-elem6）の単元だけを返す', () => {
    const units = unitsForGrade('g-elem6');
    expect(units.length).toBeGreaterThan(0);
    expect(units.every((u) => u.gradeId === 'g-elem6')).toBe(true);
  });

  it('中2（g-jhs2）の単元だけを返す', () => {
    const units = unitsForGrade('g-jhs2');
    expect(units.length).toBeGreaterThan(0);
    expect(units.every((u) => u.gradeId === 'g-jhs2')).toBe(true);
  });

  it('order（並び順）の小さい順に並ぶ', () => {
    const orders = unitsForGrade('g-elem6').map((u) => u.order);
    const sorted = [...orders].sort((a, b) => a - b);
    expect(orders).toEqual(sorted);
  });

  it('未知・未指定の学年では空の配列を返す', () => {
    expect(unitsForGrade('g-unknown')).toEqual([]);
    expect(unitsForGrade(undefined)).toEqual([]);
  });
});
