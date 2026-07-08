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

// 出題中の状態。'seeAnswer' は「答えを見る」を押したときだけ使う。
// （4回まちがえたときの正解表示は、下で wrongCount から直接みちびく）
type Status = 'answering' | 'correct' | 'seeAnswer';

// 先頭のマイナスにマッチする。半角 - ／全角 － (U+FF0D) ／マイナス記号 − (U+2212) を
// まとめて扱い、± ボタンと採点で記号がズレないようにする。
const LEADING_MINUS = /^[-－−]/;

export default function QuizScreen({ unitName, generatorKey, onBack }: QuizScreenProps) {
  const [problem, setProblem] = useState<Problem>(() => generateProblem(generatorKey));
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<Status>('answering');
  const [wrongCount, setWrongCount] = useState(0); // この問題でまちがえた回数

  // まちがえた回数から、見せるヒント数と「正解を明かすか」をその場で計算する（仕様書4-1a）。
  // レンダー中に直接みちびくので、副作用（useEffect）や余計な再描画は不要で、表示のチラつきも起きない。
  const { visibleHints, reveal: revealByWrong } = hintProgress(wrongCount);
  // 正解・解説を明かすのは「4回まちがえた」か「答えを見るを押した」とき
  const revealed = revealByWrong || status === 'seeAnswer';
  // 答え合わせ済み（正解 or 答えを明かした）なら、入力・再採点はできないようにする
  const answered = status === 'correct' || revealed;
  // いま入力の先頭にマイナスが付いているか（± ボタンの表示状態に使う）
  const hasMinus = LEADING_MINUS.test(input);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (answered) return;
    if (checkAnswer(problem.answer, input)) {
      setStatus('correct');
      return;
    }
    // まちがい：回数を1つ増やす。連続送信（Enter連打など）でも取りこぼさないよう、
    // 前回値をもとに増やす関数型更新を使う。
    setWrongCount((prev) => prev + 1);
  }

  function nextProblem() {
    setProblem(generateProblem(generatorKey));
    setInput('');
    setStatus('answering');
    setWrongCount(0);
  }

  // 先頭のマイナスを付けたり外したりする（負の答えを入力するための「±」ボタン用）。
  // 手入力の全角／記号マイナスも含めて外し、付けるときは半角の - にそろえる。
  function toggleSign() {
    setInput((prev) => (LEADING_MINUS.test(prev) ? prev.replace(LEADING_MINUS, '') : `-${prev}`));
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
          <>
            <div className="quiz-buttons">
              {/* 負の答えがありうる問題だけ、マイナスを入れる「±」ボタンを出す。
                  いまマイナスが付いていると、ボタンの色が変わって分かるようにする。 */}
              {problem.allowNegativeInput && (
                <button
                  type="button"
                  className={`quiz-sign${hasMinus ? ' quiz-sign--on' : ''}`}
                  onClick={toggleSign}
                  aria-pressed={hasMinus}
                  aria-label="こたえにマイナスをつける／はずす"
                >
                  ±
                </button>
              )}
              <button type="submit" className="quiz-submit">
                こたえあわせ
              </button>
            </div>
            {/* 「±」ボタンの使い方の説明（マイナスがありうる問題だけ出す） */}
            {problem.allowNegativeInput && (
              <p className="quiz-sign-hint">
                こたえがマイナスのときは「±」をおして、あたまに「-」をつけてね
              </p>
            )}
          </>
        )}
      </form>

      {status === 'correct' && <p className="quiz-correct">⭕ せいかい！</p>}

      {/* まちがえた回数ぶん、ヒントを1段階ずつ表示する */}
      {visibleHints > 0 && (
        <div className="quiz-hints">
          {!answered && <p className="quiz-wrong">✕ ちがうよ。ヒントを見てもう一度！</p>}
          {problem.hints.slice(0, visibleHints).map((hint, i) => (
            <p key={i} className="quiz-hint">
              <strong>ヒント{i + 1}：</strong>
              {hint}
            </p>
          ))}
        </div>
      )}

      {/* 1回でもまちがえたら「答えを見る」を出す（まだ答え合わせ前のときだけ） */}
      {!answered && wrongCount > 0 && (
        <button type="button" className="parent-link" onClick={() => setStatus('seeAnswer')}>
          答えを見る
        </button>
      )}

      {revealed && (
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
