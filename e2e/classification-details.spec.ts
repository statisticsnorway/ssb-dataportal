import { classificationDetailsTabsData } from '@/app/(details)/classifications/[id]/tabs';
import versionsMock from '@/static-data/versions.json';
import { isSupportedLanguage, localization } from '@/libs/language';
import { formatCustodian, formatLanguages, formatLocaleDate } from '@/utils/functions';
import { parseVersion } from '@/utils/mock-data';
import { Page } from '@playwright/test';
import { test, expect } from '@bgotink/playwright-coverage';

const versions = versionsMock.versions;
const currentVersion = versions![0];
const olderVersion = versions![1];

const CURRENT_DETAILS_URL = '/classifications/2003/details';
const OLDER_DETAILS_URL = `/classifications/2003/version/${olderVersion!.id ?? 2}/details`;

async function gotoAbout(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const aboutTab = page.getByRole('tab', { name: classificationDetailsTabsData.Details.label });
  await expect(aboutTab).toHaveAttribute('aria-selected', 'true');
  return page.getByLabel(localization.classificationDetails.details);
}

async function assertDetailsList(page: Page, version: (typeof versions)[number]) {
  const dl = page.locator('dl');
  await expect(dl.getByText(localization.classification.about.custodian, { exact: true })).toBeVisible();
  await expect(dl.locator('dd').getByText(formatCustodian(parseVersion(version)), { exact: true })).toBeVisible();
  await expect(dl.getByText(localization.classification.about.mail, { exact: true })).toBeVisible();
  await expect(dl.locator('dd').getByText(version.contactPerson!.email!, { exact: true })).toBeVisible();
  await expect(dl.getByText(localization.classification.about.validity, { exact: true })).toBeVisible();
  await expect(dl.locator('dd').getByText(formatLocaleDate(version.validFrom!), { exact: true })).toBeVisible();
  await expect(dl.getByText(localization.classification.about.publishedLanguages, { exact: true })).toBeVisible();
  await expect(
    dl.locator('dd').getByText((version.published ?? []).filter(isSupportedLanguage).map(formatLanguages).join(', '), {
      exact: true,
    }),
  ).toBeVisible();
}

test('displays version details', async ({ page }) => {
  await gotoAbout(page, CURRENT_DETAILS_URL);
  await assertDetailsList(page, currentVersion!);
});

test('displays version details', async ({ page }) => {
  await gotoAbout(page, OLDER_DETAILS_URL);
  await assertDetailsList(page, olderVersion!);
});
