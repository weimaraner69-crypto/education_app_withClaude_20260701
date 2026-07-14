import { describe, expect, it } from 'vitest';
import { createAttempt } from './createAttempt';

describe('createAttempt', () => {
  it('仕様書どおりの解答記録を作る', () => {
    expect(
      createAttempt({
        userId: 'child-son',
        subjectId: 'math',
        gradeId: 'g-elem6',
        unitId: 'elem6-circle-area',
        problemTypeId: 'circle-area',
        isCorrect: true,
        startedAtMs: 1_000,
        answeredAtMs: 4_250,
        hintsUsedCount: 2,
      }),
    ).toEqual({
      userId: 'child-son',
      subjectId: 'math',
      gradeId: 'g-elem6',
      unitId: 'elem6-circle-area',
      problemTypeId: 'circle-area',
      isCorrect: true,
      timeTakenMs: 3_250,
      hintsUsedCount: 2,
    });
  });

  it('不自然な時間とヒント数を記録に残さない', () => {
    const attempt = createAttempt({
      userId: 'child-son',
      subjectId: 'math',
      gradeId: 'g-elem6',
      unitId: 'elem6-circle-area',
      problemTypeId: 'circle-area',
      isCorrect: false,
      startedAtMs: 5_000,
      answeredAtMs: 1_000,
      hintsUsedCount: 10,
    });

    expect(attempt.timeTakenMs).toBe(0);
    expect(attempt.hintsUsedCount).toBe(3);
  });
});
