import type { Problem } from '../../types/problem';
import type { Rng } from '../../lib/rng';

/**
 * テンプレート（問題の型）1つを表すしくみ。
 * generate を呼ぶと、数字をその場で入れた問題を1つ組み立てて返す。
 * 答えもコード内で計算するので、必ず正しい（仕様書7-1）。
 */
export interface TemplateGenerator {
  key: string; // テンプレートの目印（例: 'mul'）。problemTypes.generatorKey に対応
  subjectId: string;
  gradeId: string;
  unitId: string;
  generate: (rng?: Rng) => Problem;
}
