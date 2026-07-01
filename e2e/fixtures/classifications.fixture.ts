import { Page, TestInfo } from '@playwright/test';
import { test as base, expect } from '@bgotink/playwright-coverage';
import { tabsData } from '@/app/(services)/tabs';
import { stabilize } from '../utils/commonUtils';
import { CLASSIFICATIONS_URL } from '../utils/variables';

export const test = base.extend<{
  classificationsPage: Page;
}>({
  classificationsPage: async ({ page }, use, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await page.goto(tabsData.Classifications.route);
    await expect(page).toHaveURL(CLASSIFICATIONS_URL);
    await stabilize();
    await use(page);
  },
});

export { expect };
