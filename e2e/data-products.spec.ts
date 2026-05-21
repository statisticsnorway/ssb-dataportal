import { expect, test } from './fixtures/dataProducts.fixture';
import { localization } from '@/libs/language';

test('Data products page displays data products', async ({ dataProductsPage }) => {
  const main = dataProductsPage.getByRole('main');

  await expect(main.getByRole('heading', { name: localization.tabs.dataProducts })).toBeVisible();
  await expect(main).toContainText('2 treff');
  await expect(main).toContainText('Tilknytning til arbeid, utdanning og velferdsordninger');
  await expect(main).toContainText('Ameldingen');
});

test('Clicking a data product navigates to details page', async ({ dataProductsPage }) => {
  const main = dataProductsPage.getByRole('main');

  await main.getByRole('link', { name: 'ameld' }).click();
  await expect(dataProductsPage).toHaveURL(/\/data-products\/ameld$/);
  await expect(dataProductsPage.getByRole('heading', { level: 1, name: 'ameld' })).toBeVisible();
});
