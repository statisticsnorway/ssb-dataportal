import { Page, TestInfo } from '@playwright/test';
import { test as base, expect } from '@bgotink/playwright-coverage';
import { CODES_URL, CODES_VERSION_URL, stabilize } from '../utils/commonUtils';

export const test = base.extend<{
  codesPage: Page;
  codesVersionPage: Page;
}>({
  codesPage: async ({ page }, use, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await page.goto(CODES_URL);
    await expect(page).toHaveURL(new RegExp(CODES_URL));
    await stabilize();
    await use(page);
  },

  codesVersionPage: async ({ page }, use, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await page.goto(CODES_VERSION_URL);
    await expect(page).toHaveURL(new RegExp(CODES_VERSION_URL));
    await stabilize();
    await use(page);
  },
});

export { expect };
