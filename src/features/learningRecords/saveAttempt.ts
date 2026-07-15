import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDb, getFirebaseUserId, isFirebaseConfigured } from '../../lib/firebase';
import type { AttemptSaveResult, LearningAttempt } from '../../types/attempt';

/**
 * 解答記録を attempts に追加する。Firebase 未接続の開発中は何も保存せずに終える。
 * 保存できないときも、問題を解く流れを止めないため、例外ではなく結果で返す。
 */
export async function saveAttempt(attempt: LearningAttempt): Promise<AttemptSaveResult> {
  if (!isFirebaseConfigured()) return 'skipped';

  try {
    const ownerUid = await getFirebaseUserId();
    await addDoc(collection(getDb(), 'attempts'), {
      ...attempt,
      ownerUid,
      answeredAt: serverTimestamp(),
    });
    return 'saved';
  } catch {
    return 'failed';
  }
}
