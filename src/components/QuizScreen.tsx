import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Problem, Answer } from '../types/problem';
import { generateProblem } from '../lib/templateEngine';
import { checkAnswer } from '../lib/checkAnswer';

// 出題画面（PLAN タスク2-3）。
// 窓口（generateProblem）から問題を1つもらい、答えを入力→採点→次の問題、という流れ。
// ・正解 … ⭕ を出して「次の問題」へ
// ・まちがい … ✕ を出してもう一度。「答えを見る」で正解と解説を表示
// ※3段階ヒント（タスク2-5）と学習記録の保存（タスク2-7）は、このあと足す。
interface QuizScreenProps {
  unitName: string; // 画面上部に出す単元名
  generatorKey: string; // どのテンプレートで出題するか
  onBack: () => void; // 単元えらびにもどる
}

// 「答えを見る」で見せる、正解の表示用文字列を作る。
function formatAnswer(answer: Answer): string {
  switch (answer.format) {
    case 'number':
      return String(answer.value);
    case 'divmod':
      return `${answer.quotient} あまり ${answer.remainder}`;
    case 'choice':
      return `${answer.correctIndex + 1} 番目`;
    case 'text':
      return answer.accepted.join(' / ');
  }
}

type Feedback = 'none' | 'wrong' | 'correct' | 'revealed';

export default function QuizScreen({ unitName, generatorKey, onBack }: QuizScreenProps) {
  const [problem, setProblem] = useState<Problem>(() => generateProblem(generatorKey));
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<Feedback>('none');

  // 答え合わせ済み（正解 or 答えを見た）なら、入力・再採点はできないようにする
  const answered = feedback === 'correct' || feedback === 'revealed';

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (answered) return;
    setFeedback(checkAnswer(problem.answer, input) ? 'correct' : 'wrong');
  }

  function nextProblem() {
    setProblem(generateProblem(generatorKey));
    setInput('');
    setFeedback('none');
  }

  return (
    <div className="quiz">
      <p className="login-lead">{unitName}</p>
      <p className="problem">{problem.prompt}</p>

      <form onSubmit={handleSubmit} className="quiz-form">
        <input
          className="quiz-input"
          type="text"
          inputMode="decimal"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={answered}
          placeholder="こたえ"
          aria-label="こたえを入力"
        />
        {!answered && (
          <button type="submit" className="quiz-submit">
            こたえあわせ
          </button>
        )}
      </form>

      {feedback === 'correct' && <p className="quiz-correct">⭕ せいかい！</p>}

      {feedback === 'wrong' && (
        <div>
          <p className="quiz-wrong">✕ ちがうよ。もう一度チャレンジ！</p>
          <button type="button" className="parent-link" onClick={() => setFeedback('revealed')}>
            答えを見る
          </button>
        </div>
      )}

      {feedback === 'revealed' && (
        <div className="quiz-reveal">
          <p>
            こたえ：<strong>{formatAnswer(problem.answer)}</strong>
          </p>
          {problem.explanation && <p>{problem.explanation}</p>}
        </div>
      )}

      {answered && (
        <button type="button" className="quiz-next" onClick={nextProblem}>
          次の問題 →
        </button>
      )}

      <div className="quiz-footer">
        <button type="button" className="parent-link" onClick={onBack}>
          ← 単元えらびにもどる
        </button>
      </div>
    </div>
  );
}
