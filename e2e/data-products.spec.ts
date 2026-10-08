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
    await expect(main.getByRole('paragraph')).toContainText('4 treff');
    await expect(main).toContainText('Arblonn');
    await expect(main).toContainText('Tilknytning til arbeid, utdanning og velferdsordninger');
  });

  test('Clicking a data product navigates to details page', async ({ page }) => {
    await page.goto(route);
    await stabilize();

    const main = page.getByRole('main');

    await main.getByRole('link', { name: 'Arblonn' }).click();
    await expect(page).toHaveURL(/\/data-products\/arblonn$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Arblonn' })).toBeVisible();
  });

  test('Data products can be filtered by product type', async ({ page }) => {
    await page.goto(route);
    await stabilize();

    const main = page.getByRole('main');
    const statisticProductFilter = main.getByRole('checkbox', { name: 'Statistikkprodukt' });
    const otherProductFilter = main.getByRole('checkbox', { name: 'Annen dataprodukt' });

    await statisticProductFilter.check();
    await expect(main.getByRole('paragraph')).toContainText('1 treff');
    await expect(main).toContainText('Tilknytning til arbeid, utdanning og velferdsordninger');
    await expect(main).not.toContainText('Arblonn');

    await otherProductFilter.check();
    await expect(main.getByRole('paragraph')).toContainText('4 treff');
    await expect(main).toContainText('Tilknytning til arbeid, utdanning og velferdsordninger');
    await expect(main).toContainText('Arblonn');

    await statisticProductFilter.uncheck();
    await expect(main.getByRole('paragraph')).toContainText('3 treff');
    await expect(main).toContainText('Arblonn');
    await expect(main).not.toContainText('Tilknytning til arbeid, utdanning og velferdsordninger');
  });

  test('Data products can be filtered by subject area', async ({ page }) => {
    await page.goto(route);
    await stabilize();

    const main = page.getByRole('main');
    const productTypeFilters = main.getByRole('group', { name: localization.products.typeFilterLabel });
    const subjectFilters = productTypeFilters.getByRole('group', { name: localization.subjectArea });
    const subjectCheckbox = (name: string) => subjectFilters.getByRole('checkbox', { name });

    await expect(subjectFilters).toBeVisible();
    await subjectCheckbox('Arbeid og lønn').check();
    await expect(main.getByRole('paragraph')).toContainText('1 treff');
    await expect(main).toContainText('Tilknytning til arbeid, utdanning og velferdsordninger');
    await expect(main).not.toContainText('Arblonn');
    await expect(main).not.toContainText('Ameldingen');

    await subjectCheckbox('Arbeid og lønn').uncheck();
    await expect(main.getByRole('paragraph')).toContainText('4 treff');
    await expect(main).toContainText('Tilknytning til arbeid, utdanning og velferdsordninger');
    await expect(main).toContainText('Arblonn');
  });
});
