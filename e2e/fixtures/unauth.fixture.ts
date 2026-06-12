import { test as base, expect } from '@bgotink/playwright-coverage';
import { Page, TestInfo } from '@playwright/test';

export const test = base.extend<{
  unauthPage: Page;
}>({
  unauthPage: async ({ page }, use, testInfo: TestInfo) => {
    test.skip(testInfo.project.name !== 'chrome-unauth');
    await use(page);
  },
});
export { expect };
