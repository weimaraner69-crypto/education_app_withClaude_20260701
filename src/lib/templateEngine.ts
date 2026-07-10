import type { Problem } from '../types/problem';
import type { TemplateGenerator } from '../features/templates/types';
import { multiplicationTemplate } from '../features/templates/multiplication';
import { circleAreaTemplate } from '../features/templates/circleArea';
import { ratioTemplate } from '../features/templates/ratio';
import { linearFunctionTemplate } from '../features/templates/linearFunction';
import { fractionMulDivTemplate } from '../features/templates/fractionMulDiv';
import { simultaneousEquationTemplate } from '../features/templates/simultaneousEquation';
import { expressionCalculationTemplate } from '../features/templates/expressionCalculation';
import { probabilityTemplate } from '../features/templates/probability';

// 出題の窓口（仕様書4-3）。
// 画面側は「問題を1つください」とここに頼むだけ。今はテンプレート方式のみ。
// 将来、AI生成方式（倉庫＝Firestoreから取り出す）分岐をここに足す。

const templates: Record<string, TemplateGenerator> = {
  [multiplicationTemplate.key]: multiplicationTemplate,
  [circleAreaTemplate.key]: circleAreaTemplate,
  [ratioTemplate.key]: ratioTemplate,
  [linearFunctionTemplate.key]: linearFunctionTemplate,
  [fractionMulDivTemplate.key]: fractionMulDivTemplate,
  [simultaneousEquationTemplate.key]: simultaneousEquationTemplate,
  [expressionCalculationTemplate.key]: expressionCalculationTemplate,
  [probabilityTemplate.key]: probabilityTemplate,
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
