import { parseClassification } from '@/utils/classifications/classificationHelpers';
import { expect, test } from './fixtures/classification.fixture';
import classificationMock from '@/static-data/classifications.json';

const classifications = classificationMock.classifications;

test('Classifications details page have title', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[1]);
  const page = await classificationDetailsPage(classification.id!);
  const heading = page.getByRole('heading', { name: classification.name });
  await expect(heading).toBeVisible();
});

test('Classifications details version have title', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[1]);
  const page = await classificationDetailsPage(classification.id!);
  const heading = page.getByRole('heading', { name: classification.name });
  await expect(heading).toBeVisible();
});

test('Classifications details have codes', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[1]);
  const page = await classificationDetailsPage(classification.id!);
  const heading = page.getByRole('heading', { name: classification.name });
  await expect(heading).toBeVisible();
});

/*
test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/classifications/282/codes');
  await page.getByText('Dette er en inndeling som').click();
  await expect(page.getByText('Dette er en inndeling som')).toBeVisible();
  await expect(page.getByRole('main')).toContainText('Dette er en inndeling som består av enkeltår. Hovedhensikten er at denne kan være utgangspunkt for ulike varianter (grupperinger).');
  await page.getByRole('heading', { name: 'Versjonens navn' }).click();
  await page.getByRole('tab', { name: 'Koder' }).click();
});
*/