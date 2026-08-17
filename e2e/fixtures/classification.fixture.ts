import { test as base, expect } from '@bgotink/playwright-coverage';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { stabilize } from '../utils/commonUtils';
import { Page, TestInfo } from '@playwright/test';

type ClassificationDetailsFixture = (id: string | number) => Promise<Page>;

export const test = base.extend<{
  classificationDetailsPage: ClassificationDetailsFixture;
}>({
  classificationDetailsPage: async ({ page }, use, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await use(async (id: string | number) => {
      await page.goto(buildUrl({ classificationId: Number(id) }));
      await stabilize();
      return page;
    });
  },
});

export { expect };

export type ClassificationFixture = Awaited<ReturnType<ClassificationDetailsFixture>>;
