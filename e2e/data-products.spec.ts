import { expect, test } from './fixtures/dataProducts.fixture';
import { localization } from '@/libs/language';

test('Data products page displays data products', async ({ dataProductsPage }) => {
  const main = dataProductsPage.getByRole('main');

  await expect(main.getByRole('heading', { name: localization.tabs.dataProducts })).toBeVisible();
  await expect(main).toContainText('3 treff');
  await expect(main).toContainText('Tilknytning til arbeid, utdanning og velferdsordninger');
  await expect(main).toContainText('Ameldingen');
});

test('Clicking a data product navigates to details page', async ({ dataProductsPage }) => {
  const main = dataProductsPage.getByRole('main');

  await main.getByRole('link', { name: 'ameld' }).click();
  await expect(dataProductsPage).toHaveURL(/\/data-products\/ameld$/);
  await expect(dataProductsPage.getByRole('heading', { level: 1, name: 'ameld' })).toBeVisible();
});

test('Data products can be filtered by product type', async ({ dataProductsPage }) => {
  const main = dataProductsPage.getByRole('main');
  const statisticProductFilter = main.getByRole('checkbox', { name: 'Statistikkprodukt (1)' });
  const otherProductFilter = main.getByRole('checkbox', { name: 'Annen dataprodukt (1)' });

  await statisticProductFilter.check();
  await expect(main).toContainText('1 treff');
  await expect(main).toContainText('Tilknytning til arbeid, utdanning og velferdsordninger');
  await expect(main).not.toContainText('Ameldingen');

  await otherProductFilter.check();
  await expect(main).toContainText('3 treff');
  await expect(main).toContainText('Tilknytning til arbeid, utdanning og velferdsordninger');
  await expect(main).toContainText('Ameldingen');

  await statisticProductFilter.uncheck();
  await expect(main).toContainText('1 treff');
  await expect(main).toContainText('Ameldingen');
  await expect(main).not.toContainText('Tilknytning til arbeid, utdanning og velferdsordninger');
});
