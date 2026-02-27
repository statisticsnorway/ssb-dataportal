import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths({
      root: '.', // make sure it points to your tsconfig.json
    }),
  ],
  test: {
    include: ['src/**/*.spec.ts', 'src/**/*.test.ts'], // only your test files
    exclude: ['node_modules', 'dist', '**/e2e/'], // never run node_modules
    globals: true,
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
  },
});
