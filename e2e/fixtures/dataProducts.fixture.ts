import { test as base, expect, Page, TestInfo } from '@playwright/test';
import { tabsData } from '@/app/(services)/tabs';
import { stabilize } from '../utils/commonUtils';

export const test = base.extend<{
  dataProductsPage: Page;
}>({
  dataProductsPage: async ({ page }, use, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await page.goto(tabsData.DataProducts.route);
    await expect(page).toHaveURL(/\/data-products$/);
    await stabilize();
    await use(page);
  },
});
export { expect };
