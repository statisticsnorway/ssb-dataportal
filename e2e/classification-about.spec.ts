import { expect, test } from './fixtures/classification.fixture';
import { classificationDetailsTabsData } from '@/app/(details)/classifications/[id]/tabs';
import versionsMock from '@/static-data/versions.json';
import { localization } from '@/libs/language';
import { formatCustodian, formatLanguages, formatLocaleDate } from '@/utils/functions';
import { parseVersion } from '@/utils/mock-data';
import { Page } from '@playwright/test';

const versions = versionsMock.versions;
const currentVersion = versions![0];
const olderVersion = versions![1];

const CURRENT_ABOUT_URL = '/classifications/2003/about';
const OLDER_ABOUT_URL = `/classifications/2003/version/${olderVersion!.id ?? 2}/about`;

async function gotoAbout(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const aboutTab = page.getByRole('tab', { name: classificationDetailsTabsData.About.label });
  await expect(aboutTab).toHaveAttribute('aria-selected', 'true');
  return page.getByLabel(localization.classificationDetails.about);
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
    dl.locator('dd').getByText(version.published!.map(formatLanguages).join(', '), { exact: true }),
  ).toBeVisible();
}

async function assertLevelsTable(page: Page, version: (typeof versions)[number]) {
  const section = await expandSection(page, localization.classification.about.levels);
  const table = section.getByRole('table');
  await expect(table).toBeVisible();

  const levels = version.levels ?? [];
  await expect(table.getByRole('row')).toHaveCount(levels.length + 1);
  for (const level of levels) {
    await expect(table.getByRole('cell', { name: String(level.levelNumber), exact: true }).first()).toBeVisible();
    await expect(table.getByRole('cell', { name: level.levelName, exact: true }).first()).toBeVisible();
  }
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

test.describe('Current version about tab', () => {
  test('displays version heading and introduction', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(2003);
    const about = await gotoAbout(page, CURRENT_ABOUT_URL);
    await expect(about.getByRole('heading', { name: currentVersion!.name })).toBeVisible();
    await expect(about.locator('p').first()).toHaveText(currentVersion!.introduction!);
  });

  test('displays version details', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(2003);
    await gotoAbout(page, CURRENT_ABOUT_URL);
    await assertDetailsList(page, currentVersion!);
  });

  test('displays version level table', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(2003);
    await gotoAbout(page, CURRENT_ABOUT_URL);
    await assertLevelsTable(page, currentVersion!);
  });

  test('displays version changelog table', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(2003);
    await gotoAbout(page, CURRENT_ABOUT_URL);
    await assertChangelogTable(page, currentVersion!);
  });
});

test.describe('Older version about tab', () => {
  test('displays version heading and introduction', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(2003);
    const about = await gotoAbout(page, OLDER_ABOUT_URL);
    await expect(about.getByRole('heading').first()).toBeVisible();
    if (olderVersion!.introduction) {
      await expect(about.locator('p').first()).toHaveText(olderVersion!.introduction);
    }
  });

  test('displays version details', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(2003);
    await gotoAbout(page, OLDER_ABOUT_URL);
    await assertDetailsList(page, olderVersion!);
  });

  test('displays version level table', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(2003);
    await gotoAbout(page, OLDER_ABOUT_URL);
    await assertLevelsTable(page, olderVersion!);
  });

  test('displays version changelog table', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(2003);
    await gotoAbout(page, OLDER_ABOUT_URL);
    await assertChangelogTable(page, olderVersion!);
  });
});
