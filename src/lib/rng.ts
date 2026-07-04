// 乱数（ランダムな数）の出どころ。
// テストのときは「決まった値」を差し込めるように、関数として外から渡せる形にしておく。
// こうすると「7×8のときは必ず56」のような確認テストが書ける。

/** 0以上1未満の数を返す関数の型 */
export type Rng = () => number;

/** 本番用の乱数（実行のたびに変わる） */
export const defaultRng: Rng = Math.random;

/** min以上max以下の整数をランダムに返す */
export function randomInt(min: number, max: number, rng: Rng = defaultRng): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}
