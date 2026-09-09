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
    const details = page.getByLabel('Changes', { exact: true }).locator('details');
    await expect(details).toBeVisible();
    await details.locator('summary').click();
    const cells = details.locator('table td[lang="no"]');
    await expect(cells.first()).toBeVisible();
  });

  test('html sets correct lang no older version', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await page.goto(buildUrl({ classificationId: classification.id!, versionId: 2, tab: 'changes' }));
    await switchLanguage(page, 'English');
    const details = page.getByLabel('Changes', { exact: true }).locator('details');
    await expect(details).toBeVisible();
    await details.locator('summary').click();
    const cells = details.locator('table td[lang="no"]');
    await expect(cells.first()).toBeVisible();
  });
  test('language tag only visible in english newest version', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await page.goto(buildUrl({ classificationId: classification.id!, tab: 'changes' }));
    await expect(page.getByLabel('Endringslogg', { exact: true }).locator('summary')).toContainText('Endringslogg');
    await switchLanguage(page, 'English');
    await expect(page.getByLabel('Changelog', { exact: true }).locator('summary')).toContainText('Changelog Norwegian');
  });

  test('language tag only visible in english older version', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await page.goto(buildUrl({ classificationId: classification.id!, versionId: 2, tab: 'changes' }));
    await expect(page.getByLabel('Endringslogg', { exact: true }).locator('summary')).toContainText('Endringslogg');
    await switchLanguage(page, 'English');
    await expect(page.getByLabel('Changelog', { exact: true }).locator('summary')).toContainText('Changelog Norwegian');
  });
});
