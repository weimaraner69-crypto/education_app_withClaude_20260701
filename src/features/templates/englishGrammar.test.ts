import { describe, expect, it } from 'vitest';
import { checkAnswer } from '../../lib/checkAnswer';
import { englishGrammarTemplate } from './englishGrammar';

describe('englishGrammarTemplate', () => {
  it('文の手がかりを使う4択問題を作る', () => {
    const problem = englishGrammarTemplate.generate(() => 0);

    expect(problem.subjectId).toBe('english');
    expect(problem.prompt).toContain('every day');
    expect(problem.choices).toEqual(['go', 'goes', 'went', 'going']);
    expect(problem.answer).toEqual({ format: 'choice', correctIndex: 0 });
    expect(checkAnswer(problem.answer, '0')).toBe(true);
    expect(problem.hints).toHaveLength(3);
  });

  it('各問題で選択肢の文言が重複しない', () => {
    for (let index = 0; index < 8; index += 1) {
      const problem = englishGrammarTemplate.generate(() => index / 8);
      expect(new Set(problem.choices).size).toBe(4);
      expect(problem.answer.format).toBe('choice');
      if (problem.answer.format === 'choice') {
        expect(problem.choices?.[problem.answer.correctIndex]).toBeDefined();
        expect(checkAnswer(problem.answer, String(problem.answer.correctIndex))).toBe(true);
      }
    }
  });
});
