import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { localization } from '@/libs/language/src/localization';
import classificationMock from '@/static-data/classifications.json';
import versionsMock from '@/static-data/versions.json';
import { parseClassification } from '@/utils/mock-data';
import { expect, test } from './fixtures/classification.fixture';
import { CODES_PREV_VERSION_URL, CODES_PREV_VERSION_URL_CODES, formatDate, switchLanguage } from './utils/commonUtils';
import { languageButton } from './utils/variables';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';

const classifications = classificationMock.classifications;
const versions = versionsMock.versions;

test.describe('Changelog is only in norwegian', () => {
  const classification = parseClassification(classifications[0]);

  test('html sets correct lang changelog latest version', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await page.goto(buildUrl({ classificationId: classification.id!, tab: 'changes' }));
    const details = page.locator('details');
    await expect(details).toBeVisible();
    // open the details element
    await details.locator('summary').click();
    // check that lang on elements is no
    await expect(details.getByRole('table')).toHaveAttribute('lang', 'no');
  });

  test('html sets correct lang no older version', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await page.goto(buildUrl({ classificationId: classification.id!, versionId: 2, tab: 'changes' }));
    await expect(page.locator('details')).toBeVisible();

    await switchLanguage(page, 'English');
    const details = page.locator('details');
    await expect(details).toBeVisible();
    await expect(details).toBeVisible();
    // open the details element
    await details.locator('summary').click();
    // check that lang on elements is no
    await expect(details.getByRole('table')).toHaveAttribute('lang', 'no');
  });

  test('language tag only visible in english newest version', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await expect(page.getByLabel('Changes', { exact: true }).locator('summary')).toContainText('Endringslogg');
    await switchLanguage(page, 'English');
    await expect(page.getByLabel('Changes', { exact: true }).locator('summary')).toContainText('Changelog Norwegian');
  });
  test('language tag only visible in english older version', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await page.goto(buildUrl({ classificationId: classification.id!, versionId: 2, tab: 'changes' }));
    await expect(page.getByLabel('Changes', { exact: true }).locator('summary')).toContainText('Endringslogg');
    await switchLanguage(page, 'English');
    await expect(page.getByLabel('Changes', { exact: true }).locator('summary')).toContainText('Changelog Norwegian');
  });
});
