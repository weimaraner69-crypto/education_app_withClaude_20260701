import { beforeEach, describe, expect, it, vi } from 'vitest';

const firestoreMocks = vi.hoisted(() => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
  serverTimestamp: vi.fn(),
}));
const firebaseMocks = vi.hoisted(() => ({
  getDb: vi.fn(),
  isFirebaseConfigured: vi.fn(),
}));

vi.mock('firebase/firestore', () => firestoreMocks);
vi.mock('../../lib/firebase', () => firebaseMocks);

import { saveAttempt } from './saveAttempt';

const attempt = {
  userId: 'child-son',
  subjectId: 'math',
  gradeId: 'g-elem6',
  unitId: 'elem6-circle-area',
  problemTypeId: 'circle-area',
  isCorrect: true,
  timeTakenMs: 1_200,
  hintsUsedCount: 0,
};

describe('saveAttempt', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    firebaseMocks.getDb.mockReturnValue({});
    firestoreMocks.collection.mockReturnValue({});
    firestoreMocks.serverTimestamp.mockReturnValue('server-time');
  });

  it('Firebase未設定のときは保存せずに終える', async () => {
    firebaseMocks.isFirebaseConfigured.mockReturnValue(false);

    await expect(saveAttempt(attempt)).resolves.toBe('skipped');
    expect(firestoreMocks.addDoc).not.toHaveBeenCalled();
  });

  it('保存できたときは saved を返す', async () => {
    firebaseMocks.isFirebaseConfigured.mockReturnValue(true);
    firestoreMocks.addDoc.mockResolvedValue({});

    await expect(saveAttempt(attempt)).resolves.toBe('saved');
    expect(firestoreMocks.addDoc).toHaveBeenCalledWith(
      {},
      expect.objectContaining({ ...attempt, answeredAt: 'server-time' }),
    );
  });

  it('保存に失敗しても failed を返す', async () => {
    firebaseMocks.isFirebaseConfigured.mockReturnValue(true);
    firestoreMocks.addDoc.mockRejectedValue(new Error('network error'));

    await expect(saveAttempt(attempt)).resolves.toBe('failed');
  });
});
