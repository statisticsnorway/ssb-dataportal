import { expect, test } from './fixtures/dataProducts.fixture';
import { localization } from '@/libs/language';
import { checkCheckbox, stabilize } from './utils/commonUtils';
import { tabsData } from '@/app/(services)/tabs';

test('Data products page displays data products', async ({ dataProductsPage }) => {
  const main = dataProductsPage.getByRole('main');

  await expect(main.getByRole('heading', { name: localization.tabs.dataProducts })).toBeVisible();
  await expect(main).toContainText('4 treff');
  await expect(main).toContainText('Arblonn');
  await expect(main).toContainText('Ameldingen');
  await expect(main).toContainText('Tilknytning til arbeid, utdanning og velferdsordninger');
});

test('Clicking a data product navigates to details page', async ({ dataProductsPage }) => {
  const main = dataProductsPage.getByRole('main');

  await main.getByRole('link', { name: 'ameld' }).click();
  await expect(dataProductsPage).toHaveURL(/\/data-products\/ameld$/);
  await expect(dataProductsPage.getByRole('heading', { level: 1, name: 'ameld' })).toBeVisible();
});

test('Data products can be filtered by product type', async ({ dataProductsPage }) => {
  const main = dataProductsPage.getByRole('main');
  const statisticProductFilter = main.getByRole('checkbox', { name: 'Statistikkprodukt' });
  const otherProductFilter = main.getByRole('checkbox', { name: 'Annen dataprodukt' });

  await statisticProductFilter.check();
  await expect(main).toContainText('1 treff');
  await expect(main).toContainText('Tilknytning til arbeid, utdanning og velferdsordninger');
  await expect(main).not.toContainText('Ameldingen');

  await otherProductFilter.check();
  await expect(main).toContainText('4 treff');
  await expect(main).toContainText('Tilknytning til arbeid, utdanning og velferdsordninger');
  await expect(main).toContainText('Ameldingen');

  await statisticProductFilter.uncheck();
  await expect(main).toContainText('3 treff');
  await expect(main).toContainText('Ameldingen');
  await expect(main).not.toContainText('Tilknytning til arbeid, utdanning og velferdsordninger');
});

test.describe('unauthenticated', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chrome-unauth');
  });

  test('Data product details page excludes datasets with no valid data files', async ({ page }) => {
    await page.goto(tabsData.DataProducts.route);
    await expect(page).toHaveURL(/\/data-products$/);
    await stabilize();
    const main = page.getByRole('main');

    await main.getByRole('link', { name: 'ameld' }).click();
    await expect(page).toHaveURL(/\/data-products\/ameld$/);
    await expect(page.getByRole('heading', { level: 1, name: 'ameld' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'valid-dataset' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'invalid-dataset' })).not.toBeVisible();
  });
});

test('Data products can be filtered by subject area', async ({ dataProductsPage }) => {
  const main = dataProductsPage.getByRole('main');
  const subjectCheckbox = (name: string) => dataProductsPage.getByRole('checkbox', { name });

  await subjectCheckbox('Arbeid og lønn').check();
  await expect(main).toContainText('2 treff');
  await expect(main).toContainText('Tilknytning til arbeid, utdanning og velferdsordninger');
  await expect(main).toContainText('Arblonn');
  await expect(main).not.toContainText('Ameldingen');

  await subjectCheckbox('Arbeid og lønn').uncheck();
  await expect(main).toContainText('4 treff');
  await expect(main).toContainText('Tilknytning til arbeid, utdanning og velferdsordninger');
  await expect(main).toContainText('Ameldingen');
  await expect(main).toContainText('Arblonn');
});
