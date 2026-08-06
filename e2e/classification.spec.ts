import { expect, test } from './fixtures/classification.fixture';
import classificationMock from '@/static-data/classifications.json';
import { localization } from '@/libs/language/src/localization';
import { CODES_PREV_VERSION_URL } from './utils/commonUtils';
import { parseClassification } from '@/utils/mock-data';
import versionsMock from '@/static-data/versions.json';

const classifications = classificationMock.classifications;
const versions = versionsMock.versions;

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
  test('All versions tab is visible', async ({ classificationDetailsPage }) => {
    const classification = parseClassification(classifications[3]);
    const page = await classificationDetailsPage(classification.id!);
    const tab = page.getByRole('tab', { name: localization.classificationDetails.versions });
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

/*
import { localization } from '@/libs/language';
import { expect, test, VERSION_URL, VERSIONS_CODES_URL } from './fixtures/classificationsVersions.fixture';
import classificationMock from '@/static-data/classifications.json';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { formatDate } from './utils/commonUtils';

const classification = classificationMock.classifications[0] as unknown as ClassificationResource;
const currentVersion = classification!.versions![0];
const olderVersion = classification!.versions![1];

test('renders versions', async ({ versionsPage }) => {
  await expect(versionsPage.getByRole('table')).toBeVisible();
});

test('renders version versions', async ({ versionsVersionPage }) => {
  await expect(versionsVersionPage.getByRole('table')).toBeVisible();
});

test('renders table', async ({ versionsPage }) => {
  await expect(versionsPage.getByRole('columnheader', { name: localization.versions.name })).toBeVisible();
  await expect(versionsPage.getByRole('columnheader', { name: localization.versions.validFrom })).toBeVisible();
  await expect(versionsPage.getByRole('columnheader', { name: localization.versions.validTo })).toBeVisible();
  await expect(versionsPage.getByRole('cell', { name: olderVersion?.name })).toBeVisible();
  await expect(versionsPage.getByRole('cell', { name: currentVersion?.name })).toBeVisible();
  await expect(versionsPage.getByRole('cell', { name: formatDate(olderVersion?.validFrom) })).toBeVisible();
  await expect(versionsPage.getByRole('cell', { name: formatDate(olderVersion?.validTo) }).nth(1)).toBeVisible();
  await expect(versionsPage.getByRole('cell', { name: formatDate(currentVersion?.validFrom) }).first()).toBeVisible();
  await expect(versionsPage.getByRole('cell', { name: localization.versions.now })).toBeVisible();
});

test('links to other versions', async ({ versionsPage }) => {
  await expect(versionsPage).toHaveURL(VERSION_URL);
  const link = versionsPage
    .getByRole('table')
    .getByRole('row')
    .filter({ hasText: olderVersion!.name })
    .getByRole('link', { name: olderVersion!.name });
  await expect(link).toBeVisible();
  await link.click();
  await expect(versionsPage).toHaveURL(VERSIONS_CODES_URL);
});

*/
