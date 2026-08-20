import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { localization } from '@/libs/language';
import versionsMock from '@/static-data/versions.json';
import { expect, test } from './fixtures/codesPage.fixture';

const versions = versionsMock.versions;
const currentVariantId = versions?.[0]?.classificationVariants?.[0]?.id ?? 0;
const currentVersionId = versions?.[0]?.id ?? 1;
const CURRENT_VARIANT_URL = buildUrl({ classificationId: 2003, variantId: currentVariantId });
const CURRENT_VARIANT_DOWNLOAD_URL = `${CURRENT_VARIANT_URL}/download?v=1&format=csv&language=nb`;
const VERSIONED_VARIANT_DOWNLOAD_URL = `${buildUrl({
  classificationId: 2003,
  versionId: currentVersionId,
  variantId: currentVariantId,
})}/download?v=1&format=csv&language=nb`;

test.describe('classification code download', () => {
  test('download dialog shows format and language selectors with defaults', async ({ codesPage }) => {
    const openDownloadDialog = codesPage.getByRole('button', {
      name: localization.classification.download.button,
    });
    await expect(openDownloadDialog).toBeVisible();
    await openDownloadDialog.click();

    const dialog = codesPage.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const formatSelect = dialog.getByLabel(localization.classification.download.formatLabel);
    const languageSelect = dialog.getByLabel(localization.classification.download.languageLabel);

    await expect(formatSelect).toBeVisible();
    await expect(languageSelect).toBeVisible();
    await expect(formatSelect).toHaveValue('csv');
    await expect(languageSelect).toHaveValue('nb');
  });

  test('download dialog triggers file download with selected format and language', async ({ codesVersionPage }) => {
    const openDownloadDialog = codesVersionPage.getByRole('button', {
      name: localization.classification.download.button,
    });
    await openDownloadDialog.click();

    const dialog = codesVersionPage.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.getByLabel(localization.classification.download.formatLabel).selectOption('xml');
    await dialog.getByLabel(localization.classification.download.languageLabel).selectOption('en');

    const [download] = await Promise.all([
      codesVersionPage.waitForEvent('download'),
      dialog.getByRole('button', { name: localization.classification.download.confirm }).click(),
    ]);

    expect(download.suggestedFilename()).toBe('classification-codes-1-en.xml');
  });

  test('download dialog can copy shareable download link', async ({ codesPage }, testInfo) => {
    test.skip(testInfo.project.name !== 'firefox');
    const openDownloadDialog = codesPage.getByRole('button', {
      name: localization.classification.download.button,
    });
    await openDownloadDialog.click();

    const dialog = codesPage.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.getByLabel(localization.classification.download.formatLabel).selectOption('xml');
    await dialog.getByLabel(localization.classification.download.languageLabel).selectOption('en');

    await expect(codesPage).toHaveURL(/\/download\?v=1&format=xml&language=en$/);

    await dialog.getByRole('button', { name: localization.classification.download.copyLink }).click();

    await expect(dialog.getByText(localization.classification.download.linkCopied)).toBeVisible();

    const clipboardText = await codesPage.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe(codesPage.url());
  });

  test('download dialog closes back to codes route and can be reopened', async ({ codesPage }) => {
    const openDownloadDialog = codesPage.getByRole('button', {
      name: localization.classification.download.button,
    });

    await openDownloadDialog.click();

    const dialog = codesPage.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(codesPage).toHaveURL(/\/codes\/download\?v=1&format=csv&language=nb$/);

    await dialog.getByRole('button', { name: 'Lukk dialogvindu' }).click();

    await expect(dialog).not.toBeVisible();
    await expect(codesPage).toHaveURL(/\/codes$/);

    await openDownloadDialog.click();

    await expect(codesPage.getByRole('dialog')).toBeVisible();
    await expect(codesPage).toHaveURL(/\/codes\/download\?v=1&format=csv&language=nb$/);
  });

  test('download works for variant codes page', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await page.goto(CURRENT_VARIANT_URL);

    const openDownloadDialog = page.getByRole('button', {
      name: localization.classification.download.button,
    });
    await openDownloadDialog.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByLabel(localization.classification.download.languageLabel).selectOption('en');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      dialog.getByRole('button', { name: localization.classification.download.confirm }).click(),
    ]);

    expect(download.suggestedFilename()).toBe(`classification-variant-codes-${currentVariantId}-en.csv`);
  });

  test('direct visit to latest variant download URL opens modal', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await page.goto(CURRENT_VARIANT_DOWNLOAD_URL);

    await expect(page).toHaveURL(CURRENT_VARIANT_DOWNLOAD_URL);

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel(localization.classification.download.formatLabel)).toHaveValue('csv');
    await expect(dialog.getByLabel(localization.classification.download.languageLabel)).toHaveValue('nb');
  });

  test('direct visit to versioned variant download URL opens modal', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await page.goto(VERSIONED_VARIANT_DOWNLOAD_URL);

    await expect(page).toHaveURL(VERSIONED_VARIANT_DOWNLOAD_URL);

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel(localization.classification.download.formatLabel)).toHaveValue('csv');
    await expect(dialog.getByLabel(localization.classification.download.languageLabel)).toHaveValue('nb');
  });
});
