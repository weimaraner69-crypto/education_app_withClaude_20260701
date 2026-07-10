import type { Figure } from '../types/problem';

export function figureLabel(figure: Figure): string {
  switch (figure.kind) {
    case 'circle':
      return `半径 ${figure.params.radius}cm の円`;
    case 'line-graph':
      return '一次関数のグラフ';
    case 'symmetry-polygon':
      return `正${figure.params.sides}角形と対称の軸`;
    case 'scale-rectangle':
      return 'もとの図形と拡大図';
    default:
      return '問題の図';
  }
}
