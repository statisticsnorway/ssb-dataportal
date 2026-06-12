import { test as base, expect } from '@bgotink/playwright-coverage';
import { Page, TestInfo } from '@playwright/test';
import { stabilize } from '../utils/commonUtils';

export const test = base.extend<{
  landingPage: Page;
}>({
  landingPage: async ({ page }, useLandingPage, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await page.goto('/');
    await stabilize();
    await useLandingPage(page);
  },
});
export { expect };
