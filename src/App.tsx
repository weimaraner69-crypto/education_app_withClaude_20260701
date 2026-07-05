import { useState } from 'react';
import type { AppUser } from './types/user';
import LoginScreen from './components/LoginScreen';
import Home from './components/Home';

// アプリの一番外側。ログインしているかどうかで画面を切り替える（PLAN タスク2-1）。
// ・まだログインしていない → ログイン画面（名前タップ／保護者PIN）
// ・ログイン済み           → ホーム画面
// いまは「今ログインしている人」をこの場所（メモリ）だけで覚えている。
// 画面を再読み込みすると忘れる。ログイン状態の保存は、あとのタスクで作る。
export default function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  if (!currentUser) {
    return <LoginScreen onLogin={setCurrentUser} />;
  }

  return <Home user={currentUser} onLogout={() => setCurrentUser(null)} />;
}
