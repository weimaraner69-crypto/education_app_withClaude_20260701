import { describe, expect, it } from 'vitest';
import { hashPin, verifyPin } from './pin';

// PIN のハッシュ化・照合ロジックの自動テスト（仕様書のテスト方針／CLAUDE.md）。
describe('pin', () => {
  // "1234" の SHA-256 は広く知られた既知の値。seedUsers.ts の初期PINと一致すること。
  const HASH_1234 = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4';

  it('hashPin は "1234" を既知のSHA-256ハッシュに変換する', async () => {
    expect(await hashPin('1234')).toBe(HASH_1234);
  });

  it('verifyPin は正しいPINで true を返す', async () => {
    expect(await verifyPin('1234', HASH_1234)).toBe(true);
  });

  it('verifyPin は間違ったPINで false を返す', async () => {
    expect(await verifyPin('0000', HASH_1234)).toBe(false);
  });
});
