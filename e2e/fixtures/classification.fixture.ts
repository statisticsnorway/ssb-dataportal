import { test as base, expect } from '@bgotink/playwright-coverage';
import { stabilize } from '../utils/commonUtils';
import { Page, TestInfo } from '@playwright/test';

type ClassificationDetailsFixture = (id: string | number) => Promise<Page>;

export const test = base.extend<{
  classificationDetailsPage: ClassificationDetailsFixture;
}>({
  classificationDetailsPage: async ({ page }, use, testInfo: TestInfo) => {
    await use(async (id: string | number) => {
      test.skip(testInfo.project.name === 'chrome-unauth');
      await page.goto(`/classifications/${id}`);
      await stabilize();
      return page;
    });
  },
});

export { expect };

// ...existing code...

export type ClassificationFixture = Awaited<ReturnType<ClassificationDetailsFixture>>;
