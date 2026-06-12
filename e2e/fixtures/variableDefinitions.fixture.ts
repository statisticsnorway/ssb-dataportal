import { Page, TestInfo } from '@playwright/test';
import { test as base, expect } from '@bgotink/playwright-coverage';
import { tabsData } from '@/app/(services)/tabs';
import { stabilize } from '../utils/commonUtils';

export const test = base.extend<{
  variableDefinitionsPage: Page;
}>({
  variableDefinitionsPage: async ({ page }, useVariableDefinitionsPage, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await page.goto(tabsData.VariableDefinitions.route);
    await expect(page).toHaveURL(/\/variable-definitions$/);
    await stabilize();
    await useVariableDefinitionsPage(page);
  },
});
export { expect };
