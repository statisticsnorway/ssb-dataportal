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

async function expandSection(page: Page, title: string) {
  const section = page.locator('details', {
    has: page.locator('summary', { hasText: title }),
  });
  await expect(section).toBeVisible();
  const summary = section.locator('summary');
  if ((await section.getAttribute('open')) === null) {
    await summary.click();
  }
  return section;
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
async function assertChangelogTable(page: Page, version: (typeof versions)[number]) {
  const section = await expandSection(page, localization.classification.about.changelog);
  const changelogs = version.changelogs ?? [];

  if (changelogs.length === 0) {
    await expect(section.getByText(localization.classification.about.noChanges)).toBeVisible();
    return;
  }

  const table = section.getByRole('table');
  await expect(table).toBeVisible();
  await expect(table.getByRole('row')).toHaveCount(changelogs.length + 1);
  for (const entry of changelogs) {
    if (entry.description) {
      await expect(table.getByText(entry.description, { exact: false }).first()).toBeVisible();
    }
  }
}

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name === 'chrome-unauth');
});

test.describe('Current version details tab', () => {
  test('displays version details', async ({ page }) => {
    await gotoAbout(page, CURRENT_DETAILS_URL);
    await assertDetailsList(page, currentVersion!);
  });

  test('displays version changelog table', async ({ page }) => {
    await gotoAbout(page, CURRENT_DETAILS_URL);
    await assertChangelogTable(page, currentVersion!);
  });
});

test.describe('Older version details tab', () => {
  test('displays version details', async ({ page }) => {
    await gotoAbout(page, OLDER_DETAILS_URL);
    await assertDetailsList(page, olderVersion!);
  });

  test('displays version changelog table', async ({ page }) => {
    await gotoAbout(page, OLDER_DETAILS_URL);
    await assertChangelogTable(page, olderVersion!);
  });
});
