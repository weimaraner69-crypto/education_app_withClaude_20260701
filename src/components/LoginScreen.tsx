import { useState } from 'react';
import type { AppUser } from '../types/user';
import { SEED_CHILDREN, SEED_PARENT } from '../features/auth/seedUsers';
import ChildPicker from './ChildPicker';
import ParentPinPad from './ParentPinPad';

// ログイン画面ぜんたい（仕様書8章／PLAN タスク2-1）。
// ふだんは子供の名前えらび画面を出し、「おうちのひと」を押したときだけ
// 保護者PIN画面に切り替える。ログインが成功したら onLogin で親に知らせる。
interface LoginScreenProps {
  onLogin: (user: AppUser) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  // 'children' = 子供えらび画面 / 'parent' = 保護者PIN画面
  const [mode, setMode] = useState<'children' | 'parent'>('children');
  // 保護者ユーザーを定数に取り出しておく（コールバック内で型が確定するようにするため）
  const parent = SEED_PARENT;

  return (
    <main>
      <h1>MiraStudy</h1>

      {mode === 'children' && (
        <ChildPicker
          childUsers={SEED_CHILDREN}
          onPick={onLogin}
          onParentTap={() => setMode('parent')}
        />
      )}

      {mode === 'parent' &&
        (parent?.pinHash ? (
          <ParentPinPad
            pinHash={parent.pinHash}
            onSuccess={() => onLogin(parent)}
            onBack={() => setMode('children')}
          />
        ) : (
          // 保護者データが無い（万一の設定漏れ）ときの保険。子供画面へ戻すボタンを出す。
          <div>
            <p className="login-lead">保護者データが見つかりません</p>
            <button type="button" className="parent-link" onClick={() => setMode('children')}>
              もどる
            </button>
          </div>
        ))}
    </main>
  );
}
