import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // load jest-dom matchers
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', //  Makes "@/..." resolve to src/...
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // mock CSS modules
    '\\.(svg)$': '<rootDir>/__mocks__/svgMock.tsx',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!react-localization/)', // transform ESM module
  ],
  testPathIgnorePatterns: ['<rootDir>/src/e2e/'], // 👈 ignore Playwright
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
