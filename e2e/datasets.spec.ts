import { expect, test } from './fixtures/datasets.fixture';
import { localization } from '@/libs/language';

test('Datasets page displays static data products', async ({ datasetsPage }) => {
  const main = datasetsPage.getByRole('main');

  await expect(main.getByRole('heading', { name: localization.tabs.datasets })).toBeVisible();
  await expect(main).toContainText('2 treff');
  await expect(main).toContainText('Tilknytning til arbeid, utdanning og velferdsordninger');
  await expect(main).toContainText('arbstatus');
  await expect(main).toContainText('Ameldingen');
  await expect(main).toContainText('ameld');
});

test('Clicking a dataset navigates to details page', async ({ datasetsPage }) => {
  const main = datasetsPage.getByRole('main');

  await main.getByRole('link', { name: 'Ameldingen' }).click();
  await expect(datasetsPage).toHaveURL(/\/datasets\/ameld$/);
  await expect(datasetsPage.getByRole('heading', { name: 'Ameldingen' })).toBeVisible();
});
