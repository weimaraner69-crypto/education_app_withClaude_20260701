import type { AppUser } from '../types/user';
import { gradeLabel } from '../lib/grades';

// 子供用ログイン画面（仕様書8章）。
// 名前（＋アイコン・学年）の大きなボタンを並べ、タップするだけでログインできる。
// パスワードを覚えなくてよいのが子供向けのねらい（仕様書5章のユーザーストーリー）。
interface ChildPickerProps {
  childUsers: AppUser[]; // 並べる子供の一覧
  onPick: (user: AppUser) => void; // ボタンが押されたときに呼ぶ
  onParentTap: () => void; // 「おうちのひと」＝保護者PIN画面へ
}

export default function ChildPicker({ childUsers, onPick, onParentTap }: ChildPickerProps) {
  return (
    <div>
      <p className="login-lead">だれがべんきょうする？</p>
      <div className="child-grid">
        {childUsers.map((child) => {
          const grade = gradeLabel(child.gradeId);
          return (
            <button key={child.id} className="child-button" onClick={() => onPick(child)}>
              <span className="child-avatar">{child.avatar}</span>
              <span className="child-name">{child.displayName}</span>
              {/* 学年が分かるときだけ表示（空欄の行が出ないように） */}
              {grade && <span className="child-grade">{grade}</span>}
            </button>
          );
        })}
      </div>
      <button className="parent-link" onClick={onParentTap}>
        🔑 おうちのひと（せってい）
      </button>
    </div>
  );
}
