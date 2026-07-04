import { useState } from 'react';
import { generateProblem } from './lib/templateEngine';
import type { Problem } from './types/problem';

// 土台の動作確認用のかんたんな画面（PLAN タスク2-3の骨組み）。
// 「次の問題」を押すたびに、かけ算テンプレートが新しい問題を作って表示する。
// 本格的な出題・採点・ヒント画面は、このあとのタスクで作り込んでいく。
export default function App() {
  const [problem, setProblem] = useState<Problem>(() => generateProblem('mul'));

  return (
    <main>
      <h1>MiraStudy</h1>
      <p>土台の動作確認（かけ算テンプレート）</p>
      <p className="problem">{problem.prompt}</p>
      <button onClick={() => setProblem(generateProblem('mul'))}>次の問題</button>
    </main>
  );
}
