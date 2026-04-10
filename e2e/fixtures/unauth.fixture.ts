import { test as base, expect, Page, TestInfo } from '@playwright/test';

export const test = base.extend<{
  unauthPage: Page;
}>({
  unauthPage: async ({ page }, use, testInfo: TestInfo) => {
    test.skip(testInfo.project.name !== 'chrome-unauth');
    await use(page);
  },
});
export { expect };
