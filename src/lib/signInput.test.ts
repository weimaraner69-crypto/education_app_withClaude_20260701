import { describe, expect, it } from 'vitest';
import { hasLeadingMinus, toggleLeadingSign } from './signInput';

// こたえ入力のマイナス符号処理の自動テスト（± ボタンのエッジケース対策）。
describe('signInput', () => {
  describe('toggleLeadingSign', () => {
    it('マイナスが無ければ半角の - を付ける', () => {
      expect(toggleLeadingSign('5')).toBe('-5');
    });

    it('半角マイナスが有れば外す', () => {
      expect(toggleLeadingSign('-5')).toBe('5');
    });

    it('全角／記号マイナスも外せる', () => {
      expect(toggleLeadingSign('－5')).toBe('5'); // 全角 －
      expect(toggleLeadingSign('−5')).toBe('5'); // 記号 −
    });

    it('先頭の空白を取り除いてから付ける（"- 5" にしない）', () => {
      expect(toggleLeadingSign(' 5')).toBe('-5');
    });

    it('先頭空白＋マイナスでも正しく外す', () => {
      expect(toggleLeadingSign(' −5')).toBe('5');
    });

    it('マイナスと数字の間の空白も残さない（"- 5" → "5"）', () => {
      expect(toggleLeadingSign('- 5')).toBe('5');
    });
  });

  describe('hasLeadingMinus', () => {
    it('先頭（空白を除く）にマイナスがあれば true', () => {
      expect(hasLeadingMinus('-5')).toBe(true);
      expect(hasLeadingMinus(' －5')).toBe(true);
    });

    it('マイナスが無ければ false', () => {
      expect(hasLeadingMinus('5')).toBe(false);
      expect(hasLeadingMinus('')).toBe(false);
    });
  });
});
