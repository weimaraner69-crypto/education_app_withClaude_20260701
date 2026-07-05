// 仕様書6-2「units（単元）」に対応する型。
// 「どの教科・どの学年の、なんという単元か」を表すマスターデータ。
// 今はローカルの仮データ（seedUnits）で動かし、あとで Firestore の units コレクションに移す。

export interface Unit {
  id: string; // 単元ID（例: 'elem6-circle-area'）
  subjectId: string; // 教科（例: 'math' = 算数・数学）
  gradeId: string; // 学年（例: 'g-elem6' = 小6）
  name: string; // 画面に出す単元名（例: '円の面積'）
  order: number; // 並び順（小さいほど先に出す）
  icon?: string; // ボタンに出すアイコン（絵文字ひと文字。無くてもよい）
  description?: string; // 補足説明（今は未使用。将来の説明表示用）
}
