import classificationMock from '@/static-data/classifications.json';
import { parseClassification } from '@/utils/mock-data';
import { expect, test } from './fixtures/classification.fixture';
import { switchLanguage } from './utils/commonUtils';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';

const classifications = classificationMock.classifications;

test.describe('Changelog is only in norwegian', () => {
  const classification = parseClassification(classifications[0]);

  test('html sets correct lang changelog latest version', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await page.goto(buildUrl({ classificationId: classification.id!, tab: 'changes' }));
    await switchLanguage(page, 'English');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByText('No changes to codes for this version')).toBeVisible();
  });

  test('html sets correct lang no older version', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await page.goto(buildUrl({ classificationId: classification.id!, versionId: 2, tab: 'changes' }));
    await switchLanguage(page, 'English');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByText('No changes to codes for this version')).toBeVisible();
  });
  test('language tag only visible in english newest version', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await page.goto(buildUrl({ classificationId: classification.id!, tab: 'changes' }));
    await expect(page.getByText('Endringslogg')).toBeVisible();
    await switchLanguage(page, 'English');
    await expect(page.getByText('Changelog Norwegian')).toBeVisible();
  });

  test('language tag only visible in english older version', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await page.goto(buildUrl({ classificationId: classification.id!, versionId: 2, tab: 'changes' }));
    await expect(page.getByText('Endringslogg')).toBeVisible();
    await switchLanguage(page, 'English');
    await expect(page.getByText('Changelog Norwegian')).toBeVisible();
  });
});
