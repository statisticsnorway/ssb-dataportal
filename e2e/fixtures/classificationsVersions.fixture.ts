import { Page, TestInfo } from '@playwright/test';
import { test as base, expect } from '@bgotink/playwright-coverage';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { stabilize } from '../utils/commonUtils';

export const MOCK_CLASSIFICATION_ID = '2003';
export const MOCK_VERSION_ID = '2';

export const VERSION_URL = `${buildUrl({ classificationId: Number(MOCK_CLASSIFICATION_ID) })}/versions`;
export const VERSIONS_VERSION_URL = `${buildUrl({
  classificationId: Number(MOCK_CLASSIFICATION_ID),
  versionId: Number(MOCK_VERSION_ID),
})}/versions`;
export const VERSIONS_CODES_URL = buildUrl({
  classificationId: Number(MOCK_CLASSIFICATION_ID),
  versionId: Number(MOCK_VERSION_ID),
  tab: 'codes',
});

export const test = base.extend<{
  versionsPage: Page;
  versionsVersionPage: Page;
}>({
  versionsPage: async ({ page }, use, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await page.goto(VERSION_URL);
    await expect(page).toHaveURL(new RegExp(VERSION_URL));
    await stabilize();
    await use(page);
  },

  versionsVersionPage: async ({ page }, use, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await page.goto(VERSIONS_VERSION_URL);
    await expect(page).toHaveURL(new RegExp(VERSIONS_VERSION_URL));
    await stabilize();
    await use(page);
  },
});

export { expect };
