import { test, expect } from '@playwright/test';
import { tabsData } from '@/app/(services)/tabs';

const route = tabsData.DataProducts.route;
const EXAMPLE_DATASET = `${route}/ameld/datasets/ds-2`;
const DATA_FILE_NAME_VIOLATES_NAMING_STANDARD = 'skjema_forelopig';

test.describe('unauthenticated', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chrome-unauth');
  });

  test('excludes files which violate the naming standard', async ({ page }) => {
    await page.goto(EXAMPLE_DATASET);
    await expect(page.getByText(DATA_FILE_NAME_VIOLATES_NAMING_STANDARD)).not.toBeVisible();
  });
});

test.describe('authenticated', () => {
  test.beforeEach(async ({}, testInfo) => {
    if (testInfo.project.name === 'chrome-unauth') testInfo.skip();
  });

  test('includes files which violate the naming standard', async ({ page }) => {
    await page.goto(EXAMPLE_DATASET);
    await expect(page.getByText(DATA_FILE_NAME_VIOLATES_NAMING_STANDARD)).toBeVisible();
  });
});
