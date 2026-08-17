import { Page, TestInfo } from '@playwright/test';
import { test as base, expect } from '@bgotink/playwright-coverage';
import { stabilize } from '../utils/commonUtils';

export const MOCK_CLASSIFICATION_ID = '2003';
export const MOCK_VERSION_ID = '2';

export const VERSION_URL = `/classifications/${MOCK_CLASSIFICATION_ID}/versions`;
export const VERSIONS_VERSION_URL = `/classifications/${MOCK_CLASSIFICATION_ID}/versions/${MOCK_VERSION_ID}/versions`;
export const VERSIONS_CODES_URL = `/classifications/${MOCK_CLASSIFICATION_ID}/versions/${MOCK_VERSION_ID}/codes`;

export const test = base.extend<{
  versionsPage: Page;
  versionsVersionPage: Page;
}>({
  versionsPage: async ({ page }, use, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await page.goto(VERSION_URL);
    await expect(page).toHaveURL(new RegExp(VERSION_URL));
    await stabilize();
    await use(page);
  },

  versionsVersionPage: async ({ page }, use, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await page.goto(VERSIONS_VERSION_URL);
    await expect(page).toHaveURL(new RegExp(VERSIONS_VERSION_URL));
    await stabilize();
    await use(page);
  },
});

export { expect };
