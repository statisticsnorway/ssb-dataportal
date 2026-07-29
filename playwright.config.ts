import { defineCoverageReporterConfig } from '@bgotink/playwright-coverage';
import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  reporter: [
    ['list'],
    process.env.CI
      ? ['blob', { outputDir: 'blob-report' }]
      : ['html', { outputFolder: 'playwright-report', open: 'never' }],
    [
      '@bgotink/playwright-coverage',
      defineCoverageReporterConfig({
        /* Path to the root files should be resolved from, most likely your repository root */
        sourceRoot: __dirname,
        /* Directory in which to write coverage reports */
        resultDir: path.join(__dirname, 'results/e2e-coverage'),
        rewritePath: ({ absolutePath, relativePath }) => {
          return absolutePath.replace(/turbopack:\/\[project\]\//, '');
        },
        /* Configure the reports to generate.
           The value is an array of istanbul reports, with optional configuration attached. */
        reports: [
          /* Create <resultDir>/coverage.lcov for consumption by tooling */
          [
            'lcovonly',
            {
              file: 'coverage.lcov',
            },
          ],
          /* Log a coverage summary at the end of the test run */
          [
            'text-summary',
            {
              file: null,
            },
          ],
        ],
        /* Configure watermarks, see https://github.com/istanbuljs/nyc#high-and-low-watermarks */
        // watermarks: {},
      }),
    ],
  ],
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Don't specify workers locally, the default is good at 50% of available cores. */
  workers: process.env.CI ? 4 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  //reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    locale: 'nb-NO',
    extraHTTPHeaders: {
      'accept-language': 'nb-NO,nb;q=0.9',
    },

    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    testIdAttribute: 'data-testid',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
        locale: 'nb-NO',
        extraHTTPHeaders: {
          'accept-language': 'nb-NO,nb;q=0.9',
        },
      },
    },
    {
      name: 'chrome-unauth',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:8000',
        locale: 'nb-NO',
        extraHTTPHeaders: {
          'accept-language': 'nb-NO,nb;q=0.9',
        },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'http://localhost:3000',
        locale: 'nb-NO',
        extraHTTPHeaders: {
          'accept-language': 'nb-NO,nb;q=0.9',
        },
      },
    },

    //{
    //  name: 'webkit',
    //  use: { ...devices['Desktop Safari'] },
    //},

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      name: 'authenticated',
      command: process.env.CI ? 'pnpm build:test && pnpm start:test' : 'pnpm dev:test',
      url: 'http://localhost:3000',
      timeout: 120 * 1000,
      reuseExistingServer: false,
    },
    {
      name: 'unauthenticated',
      command: 'pnpm build:test:unauth && pnpm start:test:unauth',
      url: 'http://localhost:8000',
      timeout: 120 * 1000,
      reuseExistingServer: false,
    },
  ],
});
