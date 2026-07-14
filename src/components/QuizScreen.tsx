import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { Problem, Answer } from '../types/problem';
import { generateProblem } from '../lib/templateEngine';
import { checkAnswer } from '../lib/checkAnswer';
import { hintProgress } from '../lib/hintProgress';
import { hasChoices } from '../lib/hasChoices';
import { hasLeadingMinus, toggleLeadingSign } from '../lib/signInput';
import { createAttempt } from '../features/learningRecords/createAttempt';
import { saveAttempt } from '../features/learningRecords/saveAttempt';
import ProblemFigure from './ProblemFigure';

// 出題画面（PLAN タスク2-3＋2-5）。
// 窓口（generateProblem）から問題を1つもらい、答えを入力→採点、という流れ。
// ・正解 … ⭕ を出して「次の問題」へ
// ・まちがい … まちがえるたびにヒントが1段階ずつ増える（仕様書4-1a）。
//   1回目→ヒント1、2回目→ヒント2、3回目→ヒント3、4回目（か「答えを見る」）で正解と解説を表示。
interface QuizScreenProps {
  unitName: string; // 画面上部に出す単元名
  generatorKey: string; // どのテンプレートで出題するか
  userId: string;
  subjectId: string;
  gradeId: string;
  unitId: string;
  onBack: () => void; // 単元えらびにもどる
}

// 「答えを見る」で見せる、正解の表示用文字列を作る。
function formatAnswer(answer: Answer): string {
  switch (answer.format) {
    case 'number':
      return String(answer.value);
    case 'divmod':
      return `${answer.quotient} あまり ${answer.remainder}`;
    case 'fraction':
      return answer.denominator === 1
        ? String(answer.numerator)
        : `${answer.numerator}/${answer.denominator}`;
    case 'pair':
      return `${answer.labels[0]} = ${answer.values[0]}、${answer.labels[1]} = ${answer.values[1]}`;
    case 'choice':
      return `${answer.correctIndex + 1} 番目`;
    case 'text':
      return answer.accepted.join(' / ');
  }
}

function inputGuide(answer: Answer): { placeholder: string; hint?: string } {
  switch (answer.format) {
    case 'fraction':
      return { placeholder: '例：3/4', hint: '分数は「分子/分母」の形で入力してね。' };
    case 'pair':
      return {
        placeholder: `${answer.labels[0]}, ${answer.labels[1]}`,
        hint: `${answer.labels[0]} と ${answer.labels[1]} を、この順番で入力してね。例：2, 3`,
      };
    default:
      return { placeholder: 'こたえ' };
  }
}

// 出題中の状態。'seeAnswer' は「答えを見る」を押したときだけ使う。
// （4回まちがえたときの正解表示は、下で wrongCount から直接みちびく）
type Status = 'answering' | 'correct' | 'seeAnswer';

export default function QuizScreen({
  unitName,
  generatorKey,
  userId,
  subjectId,
  gradeId,
  unitId,
  onBack,
}: QuizScreenProps) {
  const [problem, setProblem] = useState<Problem>(() => generateProblem(generatorKey));
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<Status>('answering');
  const [wrongCount, setWrongCount] = useState(0); // この問題でまちがえた回数
  const [saveFailed, setSaveFailed] = useState(false);
  const startedAtMsRef = useRef(Date.now());
  const attemptRecordedRef = useRef(false);
  const problemSequenceRef = useRef(0);

  // まちがえた回数から、見せるヒント数と「正解を明かすか」をその場で計算する（仕様書4-1a）。
  // レンダー中に直接みちびくので、副作用（useEffect）や余計な再描画は不要で、表示のチラつきも起きない。
  const { visibleHints, reveal: revealByWrong } = hintProgress(wrongCount);
  // 正解・解説を明かすのは「4回まちがえた」か「答えを見るを押した」とき
  const revealed = revealByWrong || status === 'seeAnswer';
  // 答え合わせ済み（正解 or 答えを明かした）なら、入力・再採点はできないようにする
  const answered = status === 'correct' || revealed;
  // いま入力の先頭にマイナスが付いているか（± ボタンの表示状態に使う）
  const hasMinus = hasLeadingMinus(input);
  const guide = inputGuide(problem.answer);
  const isChoiceQuestion = hasChoices(problem);

  function recordAttempt(isCorrect: boolean, hintsUsedCount: number) {
    if (attemptRecordedRef.current) return;

    attemptRecordedRef.current = true;
    const problemSequence = problemSequenceRef.current;
    const attempt = createAttempt({
      userId,
      subjectId,
      gradeId,
      unitId,
      problemTypeId: generatorKey,
      isCorrect,
      startedAtMs: startedAtMsRef.current,
      answeredAtMs: Date.now(),
      hintsUsedCount,
    });

    // 保存は画面操作を待たせない。次の問題へ進んだ後に古い失敗表示が出ないよう、
    // 同じ問題を表示中のときだけ保存失敗を知らせる。
    void saveAttempt(attempt).then((result) => {
      if (result === 'failed' && problemSequence === problemSequenceRef.current) {
        setSaveFailed(true);
      }
    });
  }

  function submitAnswer(value: string) {
    if (answered || attemptRecordedRef.current) return;
    if (checkAnswer(problem.answer, value)) {
      recordAttempt(true, visibleHints);
      setStatus('correct');
      return;
    }
    const nextWrongCount = wrongCount + 1;
    if (nextWrongCount >= 4) {
      recordAttempt(false, visibleHints);
    }
    // まちがい：回数を1つ増やす。連続送信（Enter連打など）でも取りこぼさないよう、
    // 前回値をもとに増やす関数型更新を使う。
    setWrongCount((prev) => prev + 1);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submitAnswer(input);
  }

  function handleChoice(index: number) {
    setInput(String(index));
    submitAnswer(String(index));
  }

  function nextProblem() {
    setProblem(generateProblem(generatorKey));
    setInput('');
    setStatus('answering');
    setWrongCount(0);
    setSaveFailed(false);
    startedAtMsRef.current = Date.now();
    attemptRecordedRef.current = false;
    problemSequenceRef.current += 1;
  }

  function revealAnswer() {
    if (answered || attemptRecordedRef.current) return;
    recordAttempt(false, visibleHints);
    setStatus('seeAnswer');
  }

  // 「±」ボタン：先頭のマイナスを付けたり外したりする（処理は src/lib/signInput に集約）。
  function toggleSign() {
    setInput(toggleLeadingSign);
  }

  return (
    <div className="quiz">
      <p className="login-lead">{unitName}</p>
      <p className="problem">{problem.prompt}</p>
      {problem.figure && <ProblemFigure figure={problem.figure} />}

      <form onSubmit={handleSubmit} className="quiz-form">
        {!isChoiceQuestion && (
          <>
            <input
              className="quiz-input"
              type="text"
              inputMode={problem.answer.format === 'number' ? 'decimal' : 'text'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={answered}
              placeholder={guide.placeholder}
              aria-label="こたえを入力"
            />
            {guide.hint && <p className="quiz-input-hint">{guide.hint}</p>}
          </>
        )}
        {!answered && (
          <>
            {isChoiceQuestion ? (
              <div className="quiz-choices" aria-label="こたえを選ぶ">
                {problem.choices?.map((choice, index) => (
                  <button
                    key={`${index}-${choice}`}
                    type="button"
                    className="quiz-choice"
                    onClick={() => handleChoice(index)}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            ) : (
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
            )}
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
        <button type="button" className="parent-link" onClick={revealAnswer}>
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
        <>
          <button type="button" className="quiz-next" onClick={nextProblem}>
            次の問題 →
          </button>
          {saveFailed && (
            <p className="quiz-save-error" role="status">
              学習記録を保存できませんでした。問題はこのまま続けられます。
            </p>
          )}
        </>
      )}

      <div className="quiz-footer">
        <button type="button" className="parent-link" onClick={onBack}>
          ← 単元えらびにもどる
        </button>
      </div>
    </div>
  );
}
