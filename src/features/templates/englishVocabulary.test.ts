import { describe, expect, it } from 'vitest';
import { checkAnswer } from '../../lib/checkAnswer';
import { englishVocabularyTemplate } from './englishVocabulary';

describe('englishVocabularyTemplate', () => {
  it('英語から日本語を選ぶ4択問題を作る', () => {
    const problem = englishVocabularyTemplate.generate(() => 0);

    expect(problem.subjectId).toBe('english');
    expect(problem.prompt).toContain('borrow');
    expect(problem.choices).toHaveLength(4);
    expect(problem.choices).toContain('借りる');
    expect(problem.answer).toEqual({ format: 'choice', correctIndex: 0 });
    expect(checkAnswer(problem.answer, '0')).toBe(true);
    expect(problem.hints).toHaveLength(3);
  });

  it('日本語から英語を選ぶ問題も作る', () => {
    const problem = englishVocabularyTemplate.generate(() => 0.99);

    expect(problem.prompt).toContain('旅行する');
    expect(problem.choices).toContain('travel');
    expect(problem.answer).toEqual({ format: 'choice', correctIndex: 3 });
    expect(checkAnswer(problem.answer, '3')).toBe(true);
    expect(new Set(problem.choices).size).toBe(4);
  });
});
