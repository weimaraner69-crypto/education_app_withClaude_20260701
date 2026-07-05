import { useState } from 'react';
import type { AppUser } from '../types/user';
import type { Unit } from '../types/unit';
import { gradeLabel } from '../lib/grades';
import { unitsForGrade } from '../features/units/seedUnits';
import UnitPicker from './UnitPicker';

// ログイン後のホーム画面。
// ・子供 … 学年に合った「単元えらび」を表示（タスク2-2）。単元を選ぶと、その単元の
//          出題画面に進む予定（出題そのものはタスク2-3以降で作る）。
// ・保護者 … 管理メニュー（ダッシュボードはタスク3-1で作る）。
interface HomeProps {
  user: AppUser;
  onLogout: () => void;
}

export default function Home({ user, onLogout }: HomeProps) {
  // いま選んでいる単元。null なら単元えらびの画面を出す。
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const units = user.role === 'child' ? unitsForGrade(user.gradeId) : [];

  return (
    <main>
      <div className="home-header">
        <span>
          {user.avatar} {user.displayName}
          {user.role === 'child' &&
            // 学年が分かるときは「さん（小6）」、分からないときは「さん」だけにする
            (gradeLabel(user.gradeId) ? ` さん（${gradeLabel(user.gradeId)}）` : ' さん')}
        </span>
        <button type="button" className="parent-link" onClick={onLogout}>
          ログアウト
        </button>
      </div>

      {user.role === 'child' ? (
        selectedUnit ? (
          // 単元を選んだあとの画面（出題は次のタスクで作るので、今は案内だけ）
          <div>
            <p className="login-lead">{selectedUnit.name}</p>
            <p>この単元の問題は、次のステップ（タスク2-3）で作ります。</p>
            <button type="button" className="parent-link" onClick={() => setSelectedUnit(null)}>
              ← 単元えらびにもどる
            </button>
          </div>
        ) : (
          <UnitPicker units={units} onSelect={setSelectedUnit} />
        )
      ) : (
        <p>保護者メニューです。学習状況をまとめる管理画面は、次のステップで作ります。</p>
      )}
    </main>
  );
}
