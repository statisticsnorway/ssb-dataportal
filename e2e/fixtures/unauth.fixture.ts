import { test as base, expect, Page, TestInfo } from '@playwright/test';

export const test = base.extend<{
  unauthPage: Page;
}>({
  unauthPage: async ({ page }, use, testInfo: TestInfo) => {
    if (testInfo.project.name !== 'chrome-unauth') {
      testInfo.skip();
    }
    await use(page);
  },
});
export { expect };
