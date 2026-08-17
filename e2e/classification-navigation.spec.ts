import { expect, test } from './fixtures/classifications.fixture';
import classificationsMock from '@/static-data/classifications.json';
import { stripTitlePrefix } from '@/utils/classifications/classificationHelpers';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { CLASSIFICATIONS_URL } from './utils/variables';
import { parseClassification } from '@/utils/mock-data';
const classifications = classificationsMock.classifications;

test('Can navigate to classification', async ({ classificationsPage }) => {
  const classification = parseClassification(classifications[0]);
  const link = classificationsPage
    .getByRole('link', { name: stripTitlePrefix(classification.name!), exact: true })
    .first();
  await link.click();
  await classificationsPage.waitForURL(buildUrl({ classificationId: classification.id, tab: 'codes' }));
  await expect(classificationsPage.getByRole('heading', { name: classification.name! })).toBeVisible();
});

test('Can navigate back from classification details page', async ({ classificationsPage }) => {
  const classification = parseClassification(classifications[0]);
  const link = classificationsPage
    .getByRole('link', { name: stripTitlePrefix(classification.name!), exact: true })
    .first();
  await link.click();
  await classificationsPage.waitForURL(buildUrl({ classificationId: classification.id, tab: 'codes' }));
  const linkHome = classificationsPage.getByLabel('Du er her:').getByRole('link', { name: 'Klassifikasjoner' });
  await expect(linkHome).toBeVisible();
  await linkHome.click();
  await expect(classificationsPage).toHaveURL(CLASSIFICATIONS_URL);
});
