import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { localization } from '@/libs/language/src/localization';
import { expect, test } from './fixtures/classification.fixture';

const CORRESPONDENCE_URL = `${buildUrl({ classificationId: 91, versionId: 363, correspondenceId: 1506 })}`;

test('correspondence details supports downloading correspondence table', async ({ page }) => {
  await page.goto(CORRESPONDENCE_URL);

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

  expect(download.suggestedFilename()).toMatch(/^classification-correspondence-table-1506-en\.xml$/);
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

test.describe('Correspondence not-found routes', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth', 'Classification details are not available unauthenticated');
  });

  test('shows a correspondence-specific not-found page for an unknown direct correspondence', async ({ page }) => {
    await page.goto(buildUrl({ classificationId: 91, correspondenceId: 999999 }));

    await expect(page.getByRole('heading', { name: 'Korrespondansetabell ikke funnet' })).toBeVisible();
    await expect(
      page.getByText('Er det skrivefeil i lenken? Eller har korrespondansetabellen blitt slettet eller flyttet?'),
    ).toBeVisible();

    const notFoundState = page.locator('section[aria-labelledby="app-not-found-title"]');
    await expect(notFoundState.getByRole('link', { name: 'Klassifikasjoner' })).toHaveAttribute('href', buildUrl({}));
    await expect(notFoundState.getByRole('link', { name: 'Korrespondanser' })).toHaveAttribute(
      'href',
      buildUrl({ classificationId: 91, tab: 'correspondences' }),
    );
  });

  test('shows a correspondence-specific not-found page for an unknown versioned correspondence', async ({ page }) => {
    await page.goto(buildUrl({ classificationId: 91, versionId: 363, correspondenceId: 999999 }));

    await expect(page.getByRole('heading', { name: 'Korrespondansetabell ikke funnet' })).toBeVisible();
    const notFoundState = page.locator('section[aria-labelledby="app-not-found-title"]');
    await expect(notFoundState.getByRole('link', { name: 'Klassifikasjoner' })).toHaveAttribute('href', buildUrl({}));
    await expect(notFoundState.getByRole('link', { name: 'Korrespondanser' })).toHaveAttribute(
      'href',
      buildUrl({ classificationId: 91, versionId: 363, tab: 'correspondences' }),
    );
  });
});
