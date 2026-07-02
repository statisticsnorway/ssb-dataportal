import { Page, TestInfo } from '@playwright/test';
import { test as base, expect } from '@bgotink/playwright-coverage';
import { stabilize } from '../utils/commonUtils';

// Classification 2003 is the first entry in the static mock data (codes-mock.json).
// Both routes below use static data in the test environment (KLASS_USE_STATIC_DATA=true).
export const MOCK_CLASSIFICATION_ID = '2003';
export const MOCK_VERSION_ID = '1';

export const CODES_URL = `/classifications/${MOCK_CLASSIFICATION_ID}/codes`;
export const CODES_VERSION_URL = `/classifications/${MOCK_CLASSIFICATION_ID}/codes/version/${MOCK_VERSION_ID}`;

export const test = base.extend<{
  codesPage: Page;
  codesVersionPage: Page;
}>({
  codesPage: async ({ page }, use, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await page.goto(CODES_URL);
    await stabilize();
    await use(page);
  },

  codesVersionPage: async ({ page }, use, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await page.goto(CODES_VERSION_URL);
    await stabilize();
    await use(page);
  },
});

export { expect };
