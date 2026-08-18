import { localization } from '@/libs/language';
import { expect, test } from './fixtures/codesPage.fixture';

test.describe('classification code download', () => {
  test('download dialog shows format and language selectors with defaults', async ({ codesPage }) => {
    const openDownloadDialog = codesPage.getByRole('button', {
      name: localization.classification.downloadCodes.button,
    });
    await expect(openDownloadDialog).toBeVisible();
    await openDownloadDialog.click();

    const dialog = codesPage.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const formatSelect = dialog.getByLabel(localization.classification.downloadCodes.formatLabel);
    const languageSelect = dialog.getByLabel(localization.classification.downloadCodes.languageLabel);

    await expect(formatSelect).toBeVisible();
    await expect(languageSelect).toBeVisible();
    await expect(formatSelect).toHaveValue('csv');
    await expect(languageSelect).toHaveValue('nb');
  });

  test('download dialog triggers file download with selected format and language', async ({ codesVersionPage }) => {
    const openDownloadDialog = codesVersionPage.getByRole('button', {
      name: localization.classification.downloadCodes.button,
    });
    await openDownloadDialog.click();

    const dialog = codesVersionPage.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.getByLabel(localization.classification.downloadCodes.formatLabel).selectOption('xml');
    await dialog.getByLabel(localization.classification.downloadCodes.languageLabel).selectOption('en');

    const [download] = await Promise.all([
      codesVersionPage.waitForEvent('download'),
      dialog.getByRole('button', { name: localization.classification.downloadCodes.confirm }).click(),
    ]);

    expect(download.suggestedFilename()).toBe('classification-codes-1-en.xml');
  });
});
