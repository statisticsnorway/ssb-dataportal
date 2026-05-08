import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    exclude: ['node_modules', 'dist', 'e2e', '.next'],
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',

      exclude: [
        'node_modules/',
        'dist/',
        'e2e/',
        '.next/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/vitest.setup.ts',
      ],
    },

}});
