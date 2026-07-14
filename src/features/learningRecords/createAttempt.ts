import type { LearningAttempt } from '../../types/attempt';

interface CreateAttemptInput extends Omit<LearningAttempt, 'timeTakenMs' | 'hintsUsedCount'> {
  startedAtMs: number;
  answeredAtMs: number;
  hintsUsedCount: number;
}

/**
 * 画面で持つ時刻とヒント数を、Firestoreへ入れる解答記録の形に整える。
 * 時刻や回数が端末の都合で不自然な値になっても、記録を壊さない範囲に収める。
 */
export function createAttempt(input: CreateAttemptInput): LearningAttempt {
  return {
    userId: input.userId,
    subjectId: input.subjectId,
    gradeId: input.gradeId,
    unitId: input.unitId,
    problemTypeId: input.problemTypeId,
    isCorrect: input.isCorrect,
    timeTakenMs: Math.max(0, Math.trunc(input.answeredAtMs - input.startedAtMs)),
    hintsUsedCount: Math.min(3, Math.max(0, Math.trunc(input.hintsUsedCount))),
  };
}
