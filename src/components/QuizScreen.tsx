import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Problem, Answer } from '../types/problem';
import { generateProblem } from '../lib/templateEngine';
import { checkAnswer } from '../lib/checkAnswer';
import { hintProgress } from '../lib/hintProgress';

// 出題画面（PLAN タスク2-3＋2-5）。
// 窓口（generateProblem）から問題を1つもらい、答えを入力→採点、という流れ。
// ・正解 … ⭕ を出して「次の問題」へ
// ・まちがい … まちがえるたびにヒントが1段階ずつ増える（仕様書4-1a）。
//   1回目→ヒント1、2回目→ヒント2、3回目→ヒント3、4回目（か「答えを見る」）で正解と解説を表示。
// ※学習記録の保存（タスク2-7）は、このあと足す。
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

type Status = 'answering' | 'correct' | 'revealed';

export default function QuizScreen({ unitName, generatorKey, onBack }: QuizScreenProps) {
  const [problem, setProblem] = useState<Problem>(() => generateProblem(generatorKey));
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<Status>('answering');
  const [wrongCount, setWrongCount] = useState(0); // この問題でまちがえた回数

  // 答え合わせ済み（正解 or 答えを見た）なら、入力・再採点はできないようにする
  const answered = status !== 'answering';
  // まちがえた回数に応じて、見せるヒント数と「正解を明かすか」を決める（仕様書4-1a）
  const { visibleHints } = hintProgress(wrongCount);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (answered) return;
    if (checkAnswer(problem.answer, input)) {
      setStatus('correct');
      return;
    }
    // まちがい：回数を1つ増やす。既定の回数に達したら正解を明かす。
    const nextWrong = wrongCount + 1;
    setWrongCount(nextWrong);
    if (hintProgress(nextWrong).reveal) {
      setStatus('revealed');
    }
  }

  function nextProblem() {
    setProblem(generateProblem(generatorKey));
    setInput('');
    setStatus('answering');
    setWrongCount(0);
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

      {status === 'correct' && <p className="quiz-correct">⭕ せいかい！</p>}

      {/* まちがえた回数ぶん、ヒントを1段階ずつ表示する */}
      {visibleHints > 0 && (
        <div className="quiz-hints">
          {status === 'answering' && (
            <p className="quiz-wrong">✕ ちがうよ。ヒントを見てもう一度！</p>
          )}
          {problem.hints.slice(0, visibleHints).map((hint, i) => (
            <p key={i} className="quiz-hint">
              <strong>ヒント{i + 1}：</strong>
              {hint}
            </p>
          ))}
        </div>
      )}

      {/* 1回でもまちがえたら「答えを見る」を出す（まだ答え合わせ前のときだけ） */}
      {status === 'answering' && wrongCount > 0 && (
        <button type="button" className="parent-link" onClick={() => setStatus('revealed')}>
          答えを見る
        </button>
      )}

      {status === 'revealed' && (
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
