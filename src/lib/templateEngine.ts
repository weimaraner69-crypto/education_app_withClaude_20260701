import type { Problem } from '../types/problem';
import type { TemplateGenerator } from '../features/templates/types';
import { multiplicationTemplate } from '../features/templates/multiplication';
import { circleAreaTemplate } from '../features/templates/circleArea';
import { ratioTemplate } from '../features/templates/ratio';

// 出題の窓口（仕様書4-3）。
// 画面側は「問題を1つください」とここに頼むだけ。今はテンプレート方式のみ。
// 将来、AI生成方式（倉庫＝Firestoreから取り出す）分岐をここに足す。

const templates: Record<string, TemplateGenerator> = {
  [multiplicationTemplate.key]: multiplicationTemplate,
  [circleAreaTemplate.key]: circleAreaTemplate,
  [ratioTemplate.key]: ratioTemplate,
};

/** 指定したテンプレートの目印（generatorKey）で、問題を1つ作って返す */
export function generateProblem(generatorKey: string): Problem {
  const template = templates[generatorKey];
  if (!template) {
    throw new Error(`未登録のテンプレートです: ${generatorKey}`);
  }
  return template.generate();
}

/** 今登録されているテンプレートの目印の一覧 */
export function listTemplateKeys(): string[] {
  return Object.keys(templates);
}
