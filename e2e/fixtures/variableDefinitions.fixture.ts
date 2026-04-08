import { test as base, expect, Page, TestInfo } from '@playwright/test';
import { tabsData } from '@/app/(services)/tabs';
import { stabilize } from '../utils/commonUtils';

export const test = base.extend<{
  variableDefinitionsPage: Page;
}>({
  variableDefinitionsPage: async ({ page }, use, testInfo: TestInfo) => {
    if (testInfo.project.name === 'chrome-unauth') {
      testInfo.skip();
    }
    await page.goto(tabsData.VariableDefinitions.route);
    await expect(page).toHaveURL(/\/variable-definitions$/);
    await stabilize();
    await use(page);
  },
});
export { expect };
