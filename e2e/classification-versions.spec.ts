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
  await expect(versionsPage.getByRole('cell', { name: formatDate(olderVersion?.validTo) })).toBeVisible();
  await expect(versionsPage.getByRole('cell', { name: formatDate(currentVersion?.validFrom) })).toBeVisible();
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
