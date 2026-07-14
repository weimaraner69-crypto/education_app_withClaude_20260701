import type { Figure } from '../types/problem';
import { figureLabel } from './figureLabel';

const VIEW_SIZE = 200;
const PADDING = 20;

function polygonPoints(sides: number): string {
  const center = VIEW_SIZE / 2;
  const radius = 70;
  return Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / sides;
    return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
  }).join(' ');
}

function CircleFigure({ radius }: { radius: number }) {
  const displayedRadius = 28 + radius * 4;
  const center = VIEW_SIZE / 2;
  return (
    <svg viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`} role="img" aria-label={`半径 ${radius}cm の円`}>
      <circle className="figure-shape" cx={center} cy={center} r={displayedRadius} />
      <line
        className="figure-measure"
        x1={center}
        y1={center}
        x2={center + displayedRadius}
        y2={center}
      />
      <circle className="figure-point" cx={center} cy={center} r="3" />
      <text
        className="figure-text"
        x={center + displayedRadius / 2}
        y={center - 7}
        textAnchor="middle"
      >
        {radius}cm
      </text>
    </svg>
  );
}

function LineGraphFigure({ slope, intercept }: { slope: number; intercept: number }) {
  const toX = (value: number) => PADDING + ((value + 5) / 10) * (VIEW_SIZE - PADDING * 2);
  const toY = (value: number) =>
    VIEW_SIZE - PADDING - ((value + 5) / 10) * (VIEW_SIZE - PADDING * 2);
  const x1 = -5;
  const x2 = 5;
  const y1 = slope * x1 + intercept;
  const y2 = slope * x2 + intercept;

  return (
    <svg viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`} role="img" aria-label="一次関数のグラフ">
      {[-4, -2, 2, 4].map((value) => (
        <g key={value} className="figure-grid">
          <line x1={toX(value)} y1={PADDING} x2={toX(value)} y2={VIEW_SIZE - PADDING} />
          <line x1={PADDING} y1={toY(value)} x2={VIEW_SIZE - PADDING} y2={toY(value)} />
        </g>
      ))}
      <line className="figure-axis" x1={PADDING} y1={toY(0)} x2={VIEW_SIZE - PADDING} y2={toY(0)} />
      <line className="figure-axis" x1={toX(0)} y1={PADDING} x2={toX(0)} y2={VIEW_SIZE - PADDING} />
      <line className="figure-line" x1={toX(x1)} y1={toY(y1)} x2={toX(x2)} y2={toY(y2)} />
      <text className="figure-text" x={VIEW_SIZE - PADDING + 4} y={toY(0) - 5}>
        x
      </text>
      <text className="figure-text" x={toX(0) + 5} y={PADDING}>
        y
      </text>
    </svg>
  );
}

function SymmetryFigure({ sides }: { sides: number }) {
  const center = VIEW_SIZE / 2;
  return (
    <svg
      viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      role="img"
      aria-label={`正${sides}角形と対称の軸`}
    >
      <polygon className="figure-shape" points={polygonPoints(sides)} />
      <line
        className="figure-symmetry-axis"
        x1={center}
        y1={PADDING}
        x2={center}
        y2={VIEW_SIZE - PADDING}
      />
      <text className="figure-text" x={center + 8} y={PADDING + 12}>
        対称の軸
      </text>
    </svg>
  );
}

function ScaleRectangleFigure({ original, scale }: { original: number; scale: number }) {
  const originalWidth = 32;
  const originalHeight = 24;
  const enlargedWidth = Math.min(88, originalWidth * scale);
  const enlargedHeight = Math.min(68, originalHeight * scale);
  return (
    <svg viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`} role="img" aria-label="もとの図形と拡大図">
      <rect className="figure-shape" x="24" y="82" width={originalWidth} height={originalHeight} />
      <text className="figure-text" x="40" y="122" textAnchor="middle">
        もと: {original}cm
      </text>
      <path className="figure-arrow" d="M76 96h22m-7-7 7 7-7 7" />
      <rect
        className="figure-shape"
        x="108"
        y={100 - enlargedHeight / 2}
        width={enlargedWidth}
        height={enlargedHeight}
      />
      <text className="figure-text" x={108 + enlargedWidth / 2} y="144" textAnchor="middle">
        {scale}倍
      </text>
    </svg>
  );
}

export default function ProblemFigure({ figure }: { figure: Figure }) {
  return (
    <div className="problem-figure" aria-label={figureLabel(figure)}>
      {figure.kind === 'circle' && <CircleFigure radius={figure.params.radius} />}
      {figure.kind === 'line-graph' && (
        <LineGraphFigure slope={figure.params.slope} intercept={figure.params.intercept} />
      )}
      {figure.kind === 'symmetry-polygon' && <SymmetryFigure sides={figure.params.sides} />}
      {figure.kind === 'scale-rectangle' && (
        <ScaleRectangleFigure original={figure.params.original} scale={figure.params.scale} />
      )}
    </div>
  );
}
