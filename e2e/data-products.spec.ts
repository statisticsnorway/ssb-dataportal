import { expect, test } from '@bgotink/playwright-coverage';
import { localization } from '@/libs/language';
import { stabilize } from './utils/commonUtils';
import { tabsData } from '@/app/(services)/tabs';

const route = tabsData.DataProducts.route;

test.describe('authenticated', () => {
  test.beforeEach(async ({}, testInfo) => {
    if (testInfo.project.name === 'chrome-unauth') testInfo.skip();
  });

  test('Data products page displays data products', async ({ page }) => {
    await page.goto(route);
    await stabilize();

    const main = page.getByRole('main');

    await expect(main.getByRole('heading', { name: localization.tabs.dataProducts })).toBeVisible();
    await expect(main).toContainText('4 treff');
    await expect(main).toContainText('Arblonn');
    await expect(main).toContainText('Ameldingen');
    await expect(main).toContainText('Tilknytning til arbeid, utdanning og velferdsordninger');
  });

  test('Clicking a data product navigates to details page', async ({ page }) => {
    await page.goto(route);
    await stabilize();

    const main = page.getByRole('main');

    await main.getByRole('link', { name: 'ameld' }).click();
    await expect(page).toHaveURL(/\/data-products\/ameld$/);
    await expect(page.getByRole('heading', { level: 1, name: 'ameld' })).toBeVisible();
  });

  test('Data products can be filtered by product type', async ({ page }) => {
    await page.goto(route);
    await stabilize();

    const main = page.getByRole('main');
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

  test('Data products can be filtered by subject area', async ({ page }) => {
    await page.goto(route);
    await stabilize();

    const main = page.getByRole('main');
    const subjectCheckbox = (name: string) => page.getByRole('checkbox', { name });

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
});

test.describe('unauthenticated', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chrome-unauth');
  });

  test('Data products page hides data products with naming standard violations', async ({ page }) => {
    await page.goto(route);
    await expect(page).toHaveURL(/\/data-products$/);
    await stabilize();
    const main = page.getByRole('main');

    await expect(main).toContainText('1 treff');
    await expect(main).toContainText('Tilknytning til arbeid, utdanning og velferdsordninger');
    await expect(main).not.toContainText('Ameldingen');
    await expect(main).not.toContainText('Arblonn');
    await expect(main.getByRole('checkbox', { name: 'Annen dataprodukt' })).not.toBeAttached();
  });

  test('Data product details page is blocked when product is filtered out', async ({ page }) => {
    await page.goto(`${route}/ameld`);
    await expect(page.getByRole('heading', { name: 'Siden finnes ikke' })).toBeVisible();
  });
});
