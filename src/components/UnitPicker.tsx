import type { Unit } from '../types/unit';

// 単元えらび画面（仕様書8章／PLAN タスク2-2）。
// ログインした子供の学年に合った単元ボタンを並べ、タップした単元を親に知らせる。
// （どの単元を並べるかは、呼び出し側で学年に応じて絞り込んでから渡す）
interface UnitPickerProps {
  units: Unit[]; // 並べる単元（学年でしぼり込み済み・並び替え済み）
  onSelect: (unit: Unit) => void; // 単元ボタンが押されたときに呼ぶ
}

const SUBJECT_LABELS: Record<string, string> = {
  english: '英語',
  math: '算数・数学',
};

export default function UnitPicker({ units, onSelect }: UnitPickerProps) {
  // 単元がまだ用意されていない学年のときの案内（画面が真っ白にならないように）
  if (units.length === 0) {
    return <p className="unit-empty">この学年の単元は、これから追加していきます。</p>;
  }

  return (
    <div>
      <p className="login-lead">どの単元をべんきょうする？</p>
      {Object.entries(
        units.reduce<Record<string, Unit[]>>((groups, unit) => {
          (groups[unit.subjectId] ??= []).push(unit);
          return groups;
        }, {}),
      ).map(([subjectId, subjectUnits]) => (
        <section
          key={subjectId}
          className="subject-section"
          aria-label={SUBJECT_LABELS[subjectId] ?? subjectId}
        >
          <h2 className="subject-heading">{SUBJECT_LABELS[subjectId] ?? subjectId}</h2>
          <div className="unit-grid">
            {subjectUnits.map((unit) => (
              <button
                key={unit.id}
                type="button"
                className="unit-button"
                onClick={() => onSelect(unit)}
              >
                {unit.icon && <span className="unit-icon">{unit.icon}</span>}
                <span className="unit-name">{unit.name}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
