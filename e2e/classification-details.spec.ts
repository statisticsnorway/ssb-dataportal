import { classificationDetailsTabsData } from '@/app/(details)/classifications/[id]/tabs';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import versionsMock from '@/static-data/versions.json';
import { isSupportedLanguage, localization } from '@/libs/language';
import { formatCustodian, formatLanguages, formatLocaleDate } from '@/utils/functions';
import { parseVersion } from '@/utils/mock-data';
import { Page } from '@playwright/test';
import { test, expect } from '@bgotink/playwright-coverage';

const versions = versionsMock.versions;
const currentVersion = versions![0];
const olderVersion = versions![1];

const CURRENT_DETAILS_URL = buildUrl({ classificationId: 2003, tab: 'details' });
const OLDER_DETAILS_URL = buildUrl({ classificationId: 2003, versionId: olderVersion!.id ?? 2, tab: 'details' });

async function gotoAbout(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const aboutTab = page.getByRole('tab', { name: classificationDetailsTabsData.Details.label });
  await expect(aboutTab).toHaveAttribute('aria-selected', 'true');
}

async function assertDetailsList(page: Page, version: (typeof versions)[number]) {
  const details = page.getByRole('tabpanel', { name: classificationDetailsTabsData.Details.label });

  const term = (label: string) => details.getByRole('term').filter({ hasText: new RegExp(`^${label}$`) });
  const definitionFor = (label: string) => term(label).locator('xpath=following-sibling::dd[1]');

  // Validity is rendered in the version header (VersionView), not inside the Details tab panel.
  const headerTerm = (label: string) => page.getByRole('term').filter({ hasText: new RegExp(`^${label}$`) });
  const headerDefinitionFor = (label: string) => headerTerm(label).locator('xpath=following-sibling::dd[1]');

  await expect(term(localization.classification.about.custodian)).toBeVisible();
  await expect(definitionFor(localization.classification.about.custodian)).toHaveText(
    formatCustodian(parseVersion(version)),
  );

  await expect(term(localization.classification.about.mail)).toBeVisible();
  await expect(definitionFor(localization.classification.about.mail)).toHaveText(version.contactPerson!.email!);

  await expect(headerTerm(localization.validity.validFrom)).toBeVisible();
  await expect(headerDefinitionFor(localization.validity.validFrom)).toHaveText(
    formatLocaleDate(version.validFrom!),
  );

  await expect(term(localization.classification.about.publishedLanguages)).toBeVisible();
  await expect(definitionFor(localization.classification.about.publishedLanguages)).toHaveText(
    (version.published ?? []).filter(isSupportedLanguage).map(formatLanguages).join(', '),
  );
}

test('displays version details current', async ({ page }) => {
  await gotoAbout(page, CURRENT_DETAILS_URL);
  await assertDetailsList(page, currentVersion!);
});

test('displays version details older', async ({ page }) => {
  await gotoAbout(page, OLDER_DETAILS_URL);
  await assertDetailsList(page, olderVersion!);
});
