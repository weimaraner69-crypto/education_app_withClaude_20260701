// 仕様書4章「問題の共通の形」「こたえの型」に対応する型定義。
// テンプレート方式で作った問題も、将来AIが作る問題も、この同じ形で扱う。
// これが「後から作り直さなくて済む」土台になる。

/** 問題を誰が作ったか（仕様書4-1） */
export type ProblemSource = 'template' | 'ai';

/**
 * こたえの型（仕様書4-2）。
 * 今は number / divmod を使い、choice / text は将来のAI文章問題・記述式のために先に用意しておく。
 */
export type Answer =
  | { format: 'number'; value: number } // 数字ひとつ（計算・図形・グラフ）
  | { format: 'divmod'; quotient: number; remainder: number } // しょう と あまり（わり算）
  | { format: 'choice'; correctIndex: number } // 選択肢の何番目が正解か（将来）
  | { format: 'text'; accepted: string[] }; // 許容する記述の一覧（さらに将来）

/**
 * 図形・グラフの「描画用データ」（任意）。
 * 数値だけを持ち、実際に絵として描くのは画面側のSVGコンポーネントが行う。
 */
export interface Figure {
  kind: string; // 例: 'circle'（円）/ 'triangle'（三角形）/ 'line-graph'（一次関数のグラフ）
  params: Record<string, number>; // 図形ごとに必要な数値（半径・底辺・高さなど）
}

/** まちがえたときに1段階ずつ出す3段階のヒント（仕様書4-1a） */
export type Hints = readonly [string, string, string];

/** 問題ひとつが持つ「共通の形」（仕様書4-1） */
export interface Problem {
  source: ProblemSource;
  subjectId: string; // 教科（例: 'math'）
  gradeId: string; // 学年（例: 'g-elem6' = 小6）
  unitId: string; // 単元（例: 'multiplication'）
  prompt: string; // 問題文（例: '7 × 8 = ?'）
  figure?: Figure; // 図（無い問題もある）
  answer: Answer; // こたえ
  choices?: string[]; // 選択肢（文章問題用。今は空）
  explanation?: string; // 解説（正解表示のときに見せる）
  hints: Hints; // 3段階ヒント
  difficulty: number; // むずかしさ 1〜5
}
