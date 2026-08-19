import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { localization } from '@/libs/language/src/localization';
import classificationMock from '@/static-data/classifications.json';
import versionsMock from '@/static-data/versions.json';
import { parseClassification, parseVersion } from '@/utils/mock-data';
import { expect, test } from './fixtures/classification.fixture';
import { CODES_PREV_VERSION_URL, CODES_PREV_VERSION_URL_CODES, formatDate, switchLanguage } from './utils/commonUtils';
import { languageButton } from './utils/variables';
import { formatCustodian, formatLocaleDate } from '@/utils/functions';
import { Page } from '@playwright/test';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { classificationDetailsTabsData } from '@/app/(details)/classifications/[id]/tabs';

const classifications = classificationMock.classifications;
const versions = versionsMock.versions;

const currentVersion = versions![0];
const olderVersion = versions![1];

async function assertDetailsList(page: Page, version: (typeof versions)[number]) {
  const dds = page.locator('dl dd');
  const manager = dds.getByText(formatCustodian(parseVersion(version)), { exact: true });
  await expect(manager).toBeVisible();
  await expect(manager).toHaveAttribute('lang', 'nb');
  const emailDd = dds.filter({ hasText: version.contactPerson!.email! });
  await expect(emailDd).toBeVisible();
  await expect(emailDd).toHaveAttribute('lang', 'nb');
  const validity = dds.getByText(formatLocaleDate(version.validFrom!), { exact: true });
  await expect(validity).toBeVisible();
  await expect(validity).toHaveAttribute('lang', 'nb');
  const publishedLanguages = dds.filter({
    hasText: 'Norwegian (Bokmål), Norwegian (Nynorsk), English',
  });
  await expect(publishedLanguages).toBeVisible();
  await expect(publishedLanguages).not.toHaveAttribute('lang', 'nb');
  /*const legalBase = dds.getByText(version.legalBase!, { exact: true });
  await expect(legalBase).toBeVisible();
  await expect(legalBase).toHaveAttribute('lang', 'nb');*/
}

// test notRelevant
//   "legalBase": "",
//    "publications": "",
//   "derivedFrom": "",

test('Classifications details page have title', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[1]);
  const page = await classificationDetailsPage(classification.id!);
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText(classification.name!);
});

test('Latest version display tag', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[0]);
  const page = await classificationDetailsPage(classification.id!);
  const tag = page.getByText(localization.versions.tags.isLatest);
  await expect(tag).toBeVisible();
  await expect(tag).toContainText('Gjeldende versjon: (Gyldig');
});

test('Outdated versions display alert', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[0]);
  const page = await classificationDetailsPage(classification.id!);
  await page.goto(CODES_PREV_VERSION_URL);
  const alert = page.getByText(localization.versions.tags.isNotCurrent);
  await expect(alert).toBeVisible();
});

test('Classifications details version have title', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[0]);
  const page = await classificationDetailsPage(classification.id!);
  const heading = page.getByRole('heading', { level: 2 });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText(classification.versions![0]!.name!);
  await expect(page.getByText(versions[0]?.introduction!)).toBeVisible();
});

test.describe('Classifications details tabs', () => {
  test('Codes tab is visible', async ({ classificationDetailsPage }) => {
    const classification = parseClassification(classifications[3]);
    const page = await classificationDetailsPage(classification.id!);
    const tab = page.getByRole('tab', { name: localization.classificationDetails.codes });
    await expect(tab).toBeVisible();
  });
  test('About tab is visible', async ({ classificationDetailsPage }) => {
    const classification = parseClassification(classifications[3]);
    const page = await classificationDetailsPage(classification.id!);
    const tab = page.getByRole('tab', { name: localization.classificationDetails.details });
    await expect(tab).toBeVisible();
  });
  test('Changes tab is visible', async ({ classificationDetailsPage }) => {
    const classification = parseClassification(classifications[3]);
    const page = await classificationDetailsPage(classification.id!);
    const tab = page.getByRole('tab', { name: localization.classificationDetails.changes });
    await expect(tab).toBeVisible();
  });
  test('Correspondences tab is visible', async ({ classificationDetailsPage }) => {
    const classification = parseClassification(classifications[3]);
    const page = await classificationDetailsPage(classification.id!);
    const tab = page.getByRole('tab', { name: localization.classificationDetails.correspondences });
    await expect(tab).toBeVisible();
  });
  test('Variants tab is visible', async ({ classificationDetailsPage }) => {
    const classification = parseClassification(classifications[3]);
    const page = await classificationDetailsPage(classification.id!);
    const tab = page.getByRole('tab', { name: localization.classificationDetails.variants });
    await expect(tab).toBeVisible();
  });
});

test.describe('All versions table on classification page', () => {
  const classification = classifications[0] as unknown as ClassificationResource;
  const currentVersion = classification.versions![0];
  const olderVersion = classification.versions![1];

  test('renders the all versions section title', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await expect(page.getByText(localization.classificationDetails.versions)).toBeVisible();
  });

  test('renders versions table when expanded', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await page.getByText(localization.classificationDetails.versions).click();
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('renders table headers and cells', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await page.getByText(localization.classificationDetails.versions).click();

    await expect(page.getByRole('columnheader', { name: localization.versions.name })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: localization.versions.validFrom })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: localization.versions.validTo })).toBeVisible();

    await expect(page.getByRole('cell', { name: olderVersion?.name })).toBeVisible();
    await expect(page.getByRole('cell', { name: currentVersion?.name })).toBeVisible();
    await expect(page.getByRole('cell', { name: formatDate(olderVersion?.validFrom) })).toBeVisible();
    await expect(page.getByRole('cell', { name: formatDate(olderVersion?.validTo) }).nth(1)).toBeVisible();
    await expect(page.getByRole('cell', { name: formatDate(currentVersion?.validFrom) }).first()).toBeVisible();
    await expect(page.getByRole('cell', { name: localization.versions.now })).toBeVisible();
  });

  test('links to other versions', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await page.getByText(localization.classificationDetails.versions).click();

    const link = page
      .getByRole('table')
      .getByRole('row')
      .filter({ hasText: olderVersion!.name! })
      .getByRole('link', { name: olderVersion!.name! });

    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(CODES_PREV_VERSION_URL_CODES);
  });
});

test('sorts versions by "valid from" when clicking the column header', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[0]);
  const page = await classificationDetailsPage(classification.id!);
  await page.getByText(localization.classificationDetails.versions).click();
  const currentVersion = classification.versions![0];
  const olderVersion = classification.versions![1];
  const validFromHeader = page.getByRole('columnheader', { name: localization.versions.validFrom });
  const rows = page.getByRole('table').getByRole('row');

  // Default order (unsorted): current version first, older version second
  await expect(rows.nth(1)).toContainText(currentVersion!.name!);
  await expect(rows.nth(2)).toContainText(olderVersion!.name!);

  // Ascending → older version should come first
  await validFromHeader.click();
  await expect(validFromHeader).toHaveAttribute('aria-sort', 'ascending');
  await expect(rows.nth(1)).toContainText(olderVersion!.name!);
  await expect(rows.nth(2)).toContainText(currentVersion!.name!);

  // Descending → current version should come first
  await validFromHeader.click();
  await expect(validFromHeader).toHaveAttribute('aria-sort', 'descending');
  await expect(rows.nth(1)).toContainText(currentVersion!.name!);
  await expect(rows.nth(2)).toContainText(olderVersion!.name!);
});

test.describe('Classification - fallback language', () => {
  test('fallback language display tag with fallback language set', async ({ classificationDetailsPage }) => {
    const classification = parseClassification(classifications[0]);
    const page = await classificationDetailsPage(classification.id!);
    await page.getByRole('button', { name: languageButton }).click();
    await page.getByRole('button', { name: 'English' }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { name: classification.name! })).toHaveAttribute('lang', 'nb');
    const tag = page.getByText('Norwegian (Bokmål)', { exact: true });
    await expect(tag).toBeVisible();
    await tag.hover();
    await expect(
      page.getByText('This classification is not available in the selected language', { exact: true }),
    ).toBeVisible();
  });
});

test('displays fallback-language tag when classification is missing in the selected language', async ({
  classificationDetailsPage,
}) => {
  const classification = parseClassification(classifications[0]);
  const page = await classificationDetailsPage(classification.id!);

  await switchLanguage(page, 'English');

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { name: classification.name! })).toHaveAttribute('lang', 'nb');

  const tag = page.getByText('Norwegian (Bokmål)', { exact: true });
  await expect(tag).toBeVisible();

  await tag.hover();
  await expect(
    page.getByText('This classification is not available in the selected language', { exact: true }),
  ).toBeVisible();
});

test('correct html lang fallback language current', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[0]);
  const page = await classificationDetailsPage(classification.id!);
  await page.goto(
    buildUrl({
      classificationId: classification.id,
      tab: classificationDetailsTabsData.Details.slug,
    }),
  );
  await expect(page.locator('dl').first()).toBeVisible();

  await switchLanguage(page, 'English');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await assertDetailsList(page, currentVersion!);
});

test('correct html lang fallback language older', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[0]);
  const page = await classificationDetailsPage(classification.id!);
  await page.goto(
    buildUrl({
      classificationId: 2003,
      versionId: olderVersion!.id ?? 2,
      tab: classificationDetailsTabsData.Details.slug,
    }),
  );
  await expect(page.locator('dl').first()).toBeVisible();
  await switchLanguage(page, 'English');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await assertDetailsList(page, olderVersion!);
});
