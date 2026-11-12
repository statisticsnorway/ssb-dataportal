import { test, expect } from '@bgotink/playwright-coverage';
import { tabsData } from '@/app/(services)/tabs';
import { localization } from '@/libs/language';

const route = tabsData.DataProducts.route;
const EXAMPLE_DATASET = `${route}/arblonn/datasets/id7`;
const VIOLATING_DATASET = `${route}/ameld/datasets/id10`;
const LONG_RANGE_DATASET = `${route}/nudb-data/datasets/id14`;
const DATA_FILE_NAME_VIOLATES_NAMING_STANDARD = 'invalid.parquet';

test('expands the long-range timeline using the local dataset fixture', async ({ page }) => {
  await page.goto(LONG_RANGE_DATASET);
  await expect(page.getByText('2025', { exact: true })).toBeVisible();
  await expect(page.getByText('2022', { exact: true })).not.toBeVisible();

  await page.getByRole('button', { name: localization.datasetDetail.showAllTimelinePeriods }).nth(1).click();

  await expect(page.getByText('2022', { exact: true })).toBeVisible();
  await expect(page.getByText('1998', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: localization.datasetDetail.showFewerTimelinePeriods }).click();

  await expect(page.getByText('2022', { exact: true })).not.toBeVisible();
});

test.describe('unauthenticated', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chrome-unauth');
  });

  test('excludes files which violate the naming standard', async ({ page }) => {
    await page.goto(EXAMPLE_DATASET);
    await expect(page.getByText(DATA_FILE_NAME_VIOLATES_NAMING_STANDARD)).not.toBeVisible();
  });

  test('exclude owning team detail', async ({ page }) => {
    await page.goto(EXAMPLE_DATASET);
    await expect(page.getByText(localization.datasetDetail.responsible)).not.toBeVisible();
  });

  test('blocks dataset with naming standard violations', async ({ page }) => {
    await page.goto(VIOLATING_DATASET);
    await expect(page.getByRole('heading', { name: localization.error.notFoundTitleDataset })).toBeVisible();
  });
});

test.describe('authenticated', () => {
  test.beforeEach(async ({}, testInfo) => {
    if (testInfo.project.name === 'chrome-unauth') testInfo.skip();
  });

  test('includes files which violate the naming standard', async ({ page }) => {
    await page.goto(EXAMPLE_DATASET);
    await expect(page.getByRole('button', { name: /invalid\.parquet/ })).toBeVisible();
  });

  test('include owning team detail', async ({ page }) => {
    await page.goto(EXAMPLE_DATASET);
    await expect(page.getByText(localization.datasetDetail.responsible)).toBeVisible();
  });
});
