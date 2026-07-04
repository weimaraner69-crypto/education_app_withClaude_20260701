import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vite（開発サーバー・ビルド）と Vitest（テスト）の設定。
export default defineConfig({
  plugins: [react()],
  test: {
    // テンプレートの計算ロジックは純粋な関数なので、ブラウザ環境は不要。
    environment: 'node',
    // Vitest の既定の除外設定（.git・coverage 等）を保ったまま、
    // macOS が外部ボリューム上に作る ._ メタデータファイルだけ追加で除く。
    exclude: [...configDefaults.exclude, '**/._*'],
  },
});
