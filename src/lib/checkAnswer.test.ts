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

    it('全角で入力しても正解として扱う（７８．５）', () => {
      // 子供が日本語入力のまま打つケース。半角に直してから採点する。
      expect(checkAnswer(answer, '７８．５')).toBe(true);
    });

    it('わずかな計算誤差は許すが、明確に違う数字は false', () => {
      expect(checkAnswer(answer, '78.500000001')).toBe(true);
      expect(checkAnswer(answer, '78.51')).toBe(false);
    });

    it('いろいろなマイナス記号（-／－／−）を半角として扱う', () => {
      const neg: Answer = { format: 'number', value: -5 };
      expect(checkAnswer(neg, '-5')).toBe(true); // 半角ハイフンマイナス
      expect(checkAnswer(neg, '－5')).toBe(true); // 全角マイナス
      expect(checkAnswer(neg, '−5')).toBe(true); // マイナス記号（U+2212）
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

    it('全角の数字（５あまり２）も true', () => {
      expect(checkAnswer(answer, '５あまり２')).toBe(true);
    });

    it('余分な数字が混ざっていたら false（5 あまり 2 999）', () => {
      expect(checkAnswer(answer, '5 あまり 2 999')).toBe(false);
    });
  });

  describe('fraction（分数）', () => {
    const answer: Answer = { format: 'fraction', numerator: 1, denominator: 2 };

    it('1/2 は true', () => {
      expect(checkAnswer(answer, '1/2')).toBe(true);
    });

    it('同じ値の 2/4 と全角の ２／４ も true', () => {
      expect(checkAnswer(answer, '2/4')).toBe(true);
      expect(checkAnswer(answer, '２／４')).toBe(true);
    });

    it('分母が0、違う分数、文字を含む入力は false', () => {
      expect(checkAnswer(answer, '1/0')).toBe(false);
      expect(checkAnswer(answer, '1/3')).toBe(false);
      expect(checkAnswer(answer, 'a/2')).toBe(false);
    });

    it('答えが整数なら、分母を省略しても true', () => {
      const integer: Answer = { format: 'fraction', numerator: 2, denominator: 1 };
      expect(checkAnswer(integer, '2')).toBe(true);
    });
  });

  describe('pair（2つの答え）', () => {
    const answer: Answer = { format: 'pair', values: [2, 3], labels: ['x', 'y'] };

    it('2, 3 と x=2, y=3 は true', () => {
      expect(checkAnswer(answer, '2, 3')).toBe(true);
      expect(checkAnswer(answer, 'x=2, y=3')).toBe(true);
    });

    it('順番が逆、余分な数、片方だけの入力は false', () => {
      expect(checkAnswer(answer, '3, 2')).toBe(false);
      expect(checkAnswer(answer, '2, 3, 4')).toBe(false);
      expect(checkAnswer(answer, '2')).toBe(false);
    });
  });

  describe('choice（選択式）', () => {
    const answer: Answer = { format: 'choice', correctIndex: 1 };

    it('正しい選択肢の番号は true', () => {
      expect(checkAnswer(answer, '1')).toBe(true);
    });

    it('別の選択肢の番号や文字は false', () => {
      expect(checkAnswer(answer, '0')).toBe(false);
      expect(checkAnswer(answer, '答え')).toBe(false);
    });
  });
});
