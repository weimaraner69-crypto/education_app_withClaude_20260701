// 3段階ヒントの出し方（仕様書4-1a）。
// 「まちがえた回数」から、いまヒントを何段階まで見せるか・正解を明かすかを決める。
// 画面（QuizScreen）から切り出しておくことで、ルールだけを自動テストで確かめられる。

/** ヒントの段階数（気づき→やり方→ほぼ答え の3段階） */
export const HINT_STAGES = 3;

/** この回数まちがえたら（または「答えを見る」を押したら）正解・解説を明かす */
export const REVEAL_AT = 4;

export interface HintProgress {
  visibleHints: number; // いま見せるヒントの数（0〜3）
  reveal: boolean; // 正解・解説を明かすか
}

/**
 * まちがえた回数に応じたヒントの見せ方を返す。
 * 例）0回=ヒントなし／1回=ヒント1まで／3回=ヒント3まで／4回=正解を明かす。
 */
export function hintProgress(wrongCount: number): HintProgress {
  const safeCount = Math.max(wrongCount, 0);
  return {
    visibleHints: Math.min(safeCount, HINT_STAGES),
    reveal: safeCount >= REVEAL_AT,
  };
}
