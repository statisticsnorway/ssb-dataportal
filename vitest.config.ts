import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths({
      root: '.', // make sure it points to tsconfig.json
    }),
  ],
  test: {
    include: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
    exclude: ['node_modules', 'dist', '**/e2e/'],
    globals: true,
    environment: 'node',
  },
});
