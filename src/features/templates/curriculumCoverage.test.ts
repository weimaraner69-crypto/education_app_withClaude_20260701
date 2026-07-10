import { describe, expect, it } from 'vitest';
import {
  approximateAreaTemplate,
  boxPlotTemplate,
  casesTemplate,
  congruenceProofTemplate,
  elementaryDataTemplate,
  letterExpressionTemplate,
  planeGeometryTemplate,
  proportionalInverseTemplate,
  scaleDrawingTemplate,
  solidVolumeTemplate,
  symmetryTemplate,
} from './curriculumCoverage';

describe('学習指導要領の不足単元テンプレート', () => {
  const templates = [
    letterExpressionTemplate,
    scaleDrawingTemplate,
    symmetryTemplate,
    approximateAreaTemplate,
    solidVolumeTemplate,
    proportionalInverseTemplate,
    elementaryDataTemplate,
    casesTemplate,
    planeGeometryTemplate,
    congruenceProofTemplate,
    boxPlotTemplate,
  ];

  it('各テンプレートが問題・答え・3段階ヒントを持つ', () => {
    for (const template of templates) {
      const problem = template.generate(() => 0.4);
      expect(problem.prompt).not.toBe('');
      expect(problem.hints).toHaveLength(3);
      expect(problem.unitId).toBe(template.unitId);
    }
  });

  it('比例、場合の数、四分位範囲を正しく計算する', () => {
    expect(proportionalInverseTemplate.generate(() => 0.0).answer).toEqual({
      format: 'number',
      value: 4,
    });
    expect(casesTemplate.generate(() => 0.0).answer).toEqual({ format: 'number', value: 4 });
    expect(boxPlotTemplate.generate(() => 0.0).answer).toEqual({ format: 'number', value: 4 });
  });

  it('文字式と合同条件は選択式として作る', () => {
    expect(letterExpressionTemplate.generate(() => 0.0).answer.format).toBe('choice');
    expect(congruenceProofTemplate.generate().answer.format).toBe('choice');
  });
});
