import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { localization } from '@/libs/language/src/localization';
import { expect, test } from './fixtures/classification.fixture';

const CORRESPONDENCE_URL = `${buildUrl({ classificationId: 91, versionId: 363, correspondenceId: 1506 })}`;

/**
 * Both url shapes reach the same table and must both offer a working download.
 */
const downloadUrlShapes = [
  { name: 'version-pinned url', url: CORRESPONDENCE_URL, tableId: 1506 },
  { name: 'version-free url', url: buildUrl({ classificationId: 91, correspondenceId: 1253 }), tableId: 1253 },
] as const;

for (const { name, url, tableId } of downloadUrlShapes) {
  test(`correspondence details supports downloading correspondence table from the ${name}`, async ({ page }) => {
    await page.goto(url);

    const openDownloadDialog = page.getByRole('link', {
      name: localization.classification.download.button,
    });
    await openDownloadDialog.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByLabel(localization.classification.download.formatLabel).selectOption('xml');
    await dialog.getByLabel(localization.classification.download.languageLabel).selectOption('en');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      dialog.getByRole('button', { name: localization.classification.download.confirm }).click(),
    ]);

    expect(download.suggestedFilename()).toBe(`classification-correspondence-table-${tableId}-en.xml`);
  });
}

test('correspondences tab links to tables without a version segment', async ({ page }) => {
  await page.goto(buildUrl({ classificationId: 91, tab: 'correspondences' }));

  await expect(page.getByRole('link', { name: /EU\/EFTA/i }).first()).toHaveAttribute(
    'href',
    buildUrl({ classificationId: 91, correspondenceId: 1253 }),
  );
});

test('version-pinned correspondences tab keeps the version in its links', async ({ page }) => {
  await page.goto(buildUrl({ classificationId: 91, versionId: 1698, tab: 'correspondences' }));

  await expect(page.getByRole('link', { name: /EU\/EFTA/i }).first()).toHaveAttribute(
    'href',
    buildUrl({ classificationId: 91, versionId: 1698, correspondenceId: 1253 }),
  );
});

test('correspondence download dialog can copy shareable link', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'firefox');
  await page.goto(CORRESPONDENCE_URL);

  const openDownloadDialog = page.getByRole('link', {
    name: localization.classification.download.button,
  });
  await openDownloadDialog.click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  await dialog.getByLabel(localization.classification.download.formatLabel).selectOption('json');
  await dialog.getByLabel(localization.classification.download.languageLabel).selectOption('en');

  await expect(page).toHaveURL(/\/correspondences\/1506\/download\?v=1&format=json&language=en$/);

  await dialog.getByRole('button', { name: localization.classification.download.copyLink }).click();

  await expect(dialog.getByText(localization.classification.download.linkCopied)).toBeVisible();

  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboardText).toBe(page.url());
});

/**
 * Static fixture facts these cases rely on (src/static-data/versions.json):
 * - correspondence 1506 exists on versions 363 and 364, both of classification 91
 * - correspondence 1507 exists on version 364 only
 * - classification 2003 has versions 1, 2 and 3, none with correspondence tables
 * - the version-free url for classification 91 resolves to version 1633, which holds
 *   correspondence 1253 but neither 1506 nor 1507
 */
const notFoundCases = [
  {
    name: 'unknown correspondence',
    url: buildUrl({ classificationId: 91, correspondenceId: 999999 }),
    correspondencesHref: buildUrl({ classificationId: 91, tab: 'correspondences' }),
  },
  {
    name: 'valid correspondence belonging to another classification',
    url: buildUrl({ classificationId: 2003, correspondenceId: 1506 }),
    correspondencesHref: buildUrl({ classificationId: 2003, tab: 'correspondences' }),
  },
  {
    name: 'valid correspondence outside the version the url resolves to',
    url: buildUrl({ classificationId: 91, correspondenceId: 1507 }),
    correspondencesHref: buildUrl({ classificationId: 91, tab: 'correspondences' }),
  },
  {
    name: 'unknown versioned correspondence',
    url: buildUrl({ classificationId: 91, versionId: 363, correspondenceId: 999999 }),
    correspondencesHref: buildUrl({ classificationId: 91, versionId: 363, tab: 'correspondences' }),
  },
  {
    name: 'valid correspondence belonging to another version',
    url: buildUrl({ classificationId: 91, versionId: 363, correspondenceId: 1507 }),
    correspondencesHref: buildUrl({ classificationId: 91, versionId: 363, tab: 'correspondences' }),
  },
] as const;

test.describe('Correspondence not-found routes', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth', 'Classification details are not available unauthenticated');
  });

  for (const { name, url, correspondencesHref } of notFoundCases) {
    test(`shows a correspondence-specific not-found page for ${name}`, async ({ page }) => {
      await page.goto(url);

      await expect(page.getByRole('heading', { name: 'Korrespondansetabell ikke funnet' })).toBeVisible();
      await expect(
        page.getByText('Er det skrivefeil i lenken? Eller har korrespondansetabellen blitt slettet eller flyttet?'),
      ).toBeVisible();

      const notFoundState = page.locator('section[aria-labelledby="app-not-found-title"]');
      await expect(notFoundState.getByRole('link', { name: 'Klassifikasjoner' })).toHaveAttribute('href', buildUrl({}));
      await expect(notFoundState.getByRole('link', { name: 'Korrespondanser' })).toHaveAttribute(
        'href',
        correspondencesHref,
      );
    });
  }
});
