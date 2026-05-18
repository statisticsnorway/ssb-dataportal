import { expect, test } from './fixtures/dataProducts.fixture';
import { localization } from '@/libs/language';

test('Data products page displays static data product short names', async ({ dataProductsPage }) => {
  const main = dataProductsPage.getByRole('main');

  await expect(main.getByRole('heading', { name: localization.tabs.dataProducts })).toBeVisible();
  await expect(main).toContainText('2 treff');
  await expect(main).toContainText('arbstatus');
  await expect(main).toContainText('ameld');
});

test('Clicking a data product navigates to details page', async ({ dataProductsPage }) => {
  const main = dataProductsPage.getByRole('main');

  await main.getByRole('link', { name: 'ameld' }).click();
  await expect(dataProductsPage).toHaveURL(/\/data-products\/ameld$/);
  await expect(dataProductsPage.getByRole('heading', { name: 'ameld' })).toBeVisible();
});
