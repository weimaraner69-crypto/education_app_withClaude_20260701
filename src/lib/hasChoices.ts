import type { Problem } from '../types/problem';

/** 選択式として表示できる問題かを調べる。選択肢が空なら入力式として扱う。 */
export function hasChoices(problem: Pick<Problem, 'answer' | 'choices'>): boolean {
  return problem.answer.format === 'choice' && (problem.choices?.length ?? 0) > 0;
}
