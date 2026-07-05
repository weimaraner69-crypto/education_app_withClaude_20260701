import { useState } from 'react';
import type { AppUser } from '../types/user';
import { gradeLabel } from '../lib/grades';
import { generateProblem } from '../lib/templateEngine';
import type { Problem } from '../types/problem';

// ログイン後の仮ホーム画面。
// 本格的な「単元えらび（タスク2-2）」や「保護者ダッシュボード（タスク3-1）」は
// このあと作る。今はログインが正しく動くことを確かめるための、簡単な受け皿。
interface HomeProps {
  user: AppUser;
  onLogout: () => void;
}

export default function Home({ user, onLogout }: HomeProps) {
  // 子供ログインの動作確認用に、これまでのかけ算テンプレートも残しておく。
  const [problem, setProblem] = useState<Problem>(() => generateProblem('mul'));

  return (
    <main>
      <div className="home-header">
        <span>
          {user.avatar} {user.displayName}
          {user.role === 'child' && ` さん（${gradeLabel(user.gradeId)}）`}
        </span>
        <button className="parent-link" onClick={onLogout}>
          ログアウト
        </button>
      </div>

      {user.role === 'child' ? (
        <>
          <p>ようこそ！ここに「単元えらび」がならびます（次のステップで作ります）。</p>
          <p className="problem">{problem.prompt}</p>
          <button onClick={() => setProblem(generateProblem('mul'))}>次の問題</button>
        </>
      ) : (
        <p>保護者メニューです。学習状況をまとめる管理画面は、次のステップで作ります。</p>
      )}
    </main>
  );
}
