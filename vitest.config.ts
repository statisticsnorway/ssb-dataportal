import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths({
      root: '.', // make sure it points to your tsconfig.json
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
