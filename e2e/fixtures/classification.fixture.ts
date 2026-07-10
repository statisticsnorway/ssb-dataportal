import { test as base, expect } from '@bgotink/playwright-coverage';
import { stabilize } from '../utils/commonUtils';
import { Page, TestInfo } from '@playwright/test';

type ClassificationDetailsFixture = (id: string | number) => Promise<Page>;

export const test = base.extend<{
  classificationDetailsPage: ClassificationDetailsFixture;
}>({
  classificationDetailsPage: async ({ page }, use, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await use(async (id: string | number) => {
      await page.goto(`/classifications/${id}`);
      await stabilize();
      return page;
    });
  },
});

export { expect };

export type ClassificationFixture = Awaited<ReturnType<ClassificationDetailsFixture>>;
