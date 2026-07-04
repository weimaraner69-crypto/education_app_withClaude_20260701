import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vite（開発サーバー・ビルド）と Vitest（テスト）の設定。
export default defineConfig({
  plugins: [react()],
  test: {
    // テンプレートの計算ロジックは純粋な関数なので、ブラウザ環境は不要。
    environment: 'node',
    // macOS が外部ボリューム上に作る ._ メタデータファイルをテスト対象から除く。
    exclude: ['**/node_modules/**', '**/dist/**', '**/._*'],
  },
});
