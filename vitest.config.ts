import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths({
      root: '.',
    }),
  ],
  test: {
    exclude: ['node_modules', 'dist', '**/e2e/'],
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
});
