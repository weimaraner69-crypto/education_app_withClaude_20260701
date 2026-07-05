import { describe, expect, it } from 'vitest';
import { checkAnswer } from './checkAnswer';
import type { Answer } from '../types/problem';

// 採点ロジックの自動テスト（仕様書4-2）。
describe('checkAnswer', () => {
  describe('number（数字ひとつ）', () => {
    const answer: Answer = { format: 'number', value: 78.5 };

    it('正しい数字は true', () => {
      expect(checkAnswer(answer, '78.5')).toBe(true);
    });

    it('前後の空白は無視する', () => {
      expect(checkAnswer(answer, '  78.5 ')).toBe(true);
    });

    it('ちがう数字は false', () => {
      expect(checkAnswer(answer, '78')).toBe(false);
    });

    it('数字でない入力は false', () => {
      expect(checkAnswer(answer, 'あ')).toBe(false);
    });

    it('空欄は false', () => {
      expect(checkAnswer(answer, '   ')).toBe(false);
    });
  });

  describe('divmod（しょう・あまり）', () => {
    const answer: Answer = { format: 'divmod', quotient: 5, remainder: 2 };

    it('「5 あまり 2」は true', () => {
      expect(checkAnswer(answer, '5 あまり 2')).toBe(true);
    });

    it('「5あまり2」も true', () => {
      expect(checkAnswer(answer, '5あまり2')).toBe(true);
    });

    it('しょうだけ合っていても false', () => {
      expect(checkAnswer(answer, '5 あまり 3')).toBe(false);
    });
  });
});
