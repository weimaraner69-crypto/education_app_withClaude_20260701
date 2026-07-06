// 仕様書6-2「units（単元）」に対応する型。
// 「どの教科・どの学年の、なんという単元か」を表すマスターデータ。
// 今はローカルの仮データ（seedUnits）で動かし、あとで Firestore の units コレクションに移す。

export interface Unit {
  id: string; // 単元ID（例: 'elem6-circle-area'）
  subjectId: string; // 教科（例: 'math' = 算数・数学）
  gradeId: string; // 学年（例: 'g-elem6' = 小6）
  name: string; // 画面に出す単元名（例: '円の面積'）
  order: number; // 並び順（小さいほど先に出す）
  icon?: string; // ボタンに出すアイコン（表示用の絵文字。⚖️ のように複数文字のこともある。無くてもよい）
  description?: string; // 補足説明（今は未使用。将来の説明表示用）
  // テンプレート方式のとき、どのテンプレートで出題するかの目印。
  // 出題窓口 templateEngine に登録されたテンプレートの key（TemplateGenerator.key）を指す。
  // 将来 Firestore に移すときは problemTypes.generatorKey がこの役割を担う。
  // これが無い単元は「まだ問題が用意されていない（準備中）」として扱う。
  generatorKey?: string;
}
