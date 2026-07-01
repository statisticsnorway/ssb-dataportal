import { expect, test } from './fixtures/classifications.fixture';
import classificationsMock from '@/static-data/classifications.json';
import { parseClassification, stripTitlePrefix } from '@/utils/classifications/classificationHelpers';
const classifications = classificationsMock.classifications;

test('Can navigate to classification', async ({ classificationsPage }) => {
  const classification = parseClassification(classifications[0]);
  const link = classificationsPage.getByRole('link', { name: classification.name! });
  await link.click();
  await expect(classificationsPage.getByRole('heading', { name: classification.name! })).toBeVisible();
});
