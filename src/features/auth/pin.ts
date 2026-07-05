// 保護者PIN（暗証番号）のハッシュ化と照合。
// ブラウザ標準の Web Crypto（crypto.subtle）で SHA-256 のハッシュにする。
//
// ⚠️ 注意：4桁PINのSHA-256だけでは、本格的なセキュリティにはならない
//   （総当たりで元の番号に戻せてしまう）。ここは「Firebase 接続前でも
//   保護者PIN画面を動かす」ための仮実装。本番の保存・照合は、あとで
//   Firebase 側（サーバー）で行う。仕様書6-2 の pinHash に対応。

/** PIN文字列を SHA-256 の16進文字列（64文字）に変換する。 */
export async function hashPin(pin: string): Promise<string> {
  // Web Crypto（crypto.subtle）は HTTPS か localhost でしか使えない。
  // 使えない環境では「undefined を読もうとした」という分かりにくい例外になるので、
  // 先に確認して、原因が分かるはっきりしたエラーで止める。
  if (!globalThis.crypto?.subtle) {
    throw new Error(
      'この環境では暗号化機能（Web Crypto）が使えないため、PINを照合できません。 ' +
        'HTTPS または localhost で開いているか確認してください。',
    );
  }
  const data = new TextEncoder().encode(pin);
  // チェックと同じ globalThis.crypto を参照して、環境差でズレないようにする。
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
  // バイト列を16進数の文字列に並べ直す（例: 0a1b2c...）
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** 入力されたPINが、保存済みのハッシュと一致するかを判定する。 */
export async function verifyPin(pin: string, pinHash: string): Promise<boolean> {
  return (await hashPin(pin)) === pinHash;
}
