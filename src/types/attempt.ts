// 仕様書6-2の attempts（解答記録）に対応する型。
// answeredAt は Firestore のサーバー時刻で付けるため、画面から渡す値には含めない。
export interface LearningAttempt {
  userId: string;
  subjectId: string;
  gradeId: string;
  unitId: string;
  problemTypeId: string;
  isCorrect: boolean;
  timeTakenMs: number;
  hintsUsedCount: number;
}

export type AttemptSaveResult = 'saved' | 'skipped' | 'failed';
