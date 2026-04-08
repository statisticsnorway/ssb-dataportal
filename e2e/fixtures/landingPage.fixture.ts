import { test as base, expect, Page, TestInfo } from '@playwright/test';
import { stabilize } from '../utils/commonUtils';

export const test = base.extend<{
  landingPage: Page;
}>({
  landingPage: async ({ page }, use, testInfo: TestInfo) => {
    if (
      testInfo.project.name === 'chrome-unauth' &&
      !testInfo.annotations.find((a) => a.type === 'allowUnauthChrome')
    ) {
      testInfo.skip();
    }
    await page.goto('/');
    await stabilize();
    await use(page);
  },
});
export { expect };
