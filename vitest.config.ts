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
      enabled: true,
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'dist/',
        'e2e/',
        '.next/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/vitest.setup.ts',
        '**/libs/data-access/**',
        'src/static-data/**',
        'src/libs/language/src/{en,nb,nn}.ts',
        '**/*.spec.{ts,tsx}',
        '**/index.ts',
        '**/types.ts',
      ],
    },
}});
