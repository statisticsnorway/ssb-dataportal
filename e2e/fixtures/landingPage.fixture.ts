import { test as base, expect } from '@bgotink/playwright-coverage';
import { Page, TestInfo } from '@playwright/test';
import { stabilize } from '../utils/commonUtils';

export const test = base.extend<{
  landingPage: Page;
}>({
  landingPage: async ({ page }, use, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await page.goto('/');
    await stabilize();
    await use(page);
  },
});
export { expect };
