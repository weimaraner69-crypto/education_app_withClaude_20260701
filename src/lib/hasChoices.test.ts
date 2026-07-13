import { describe, expect, it } from 'vitest';
import { hasChoices } from './hasChoices';

describe('hasChoices', () => {
  it('選択肢が1つ以上ある選択式問題だけを選択式として扱う', () => {
    expect(hasChoices({ answer: { format: 'choice', correctIndex: 0 }, choices: ['yes'] })).toBe(
      true,
    );
    expect(hasChoices({ answer: { format: 'choice', correctIndex: 0 }, choices: [] })).toBe(false);
  });

  it('数値問題は選択肢があっても入力式として扱う', () => {
    expect(hasChoices({ answer: { format: 'number', value: 1 }, choices: ['1'] })).toBe(false);
  });
});
