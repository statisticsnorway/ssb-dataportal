import { localization } from '@/libs/language/src/localization';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { Page } from '@playwright/test';
import { expect, test } from './fixtures/classification.fixture';
import versionsMock from '@/static-data/versions.json';

const currentVersion = versionsMock.versions![0];

const CHANGES_CLASSIFICATION_ID = 91;
const NO_CHANGES_CLASSIFICATION_ID = 2003;

async function openChangesTab(classificationDetailsPage: (id: string | number) => Promise<Page>, id: number) {
  const page = await classificationDetailsPage(id);
  const changesTab = page.getByRole('tab', { name: localization.classificationDetails.changes });
  await expect(changesTab).toBeVisible();
  await changesTab.click();
  await expect(page).toHaveURL(buildUrl({ classificationId: id, tab: 'changes' }));
  return page;
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

async function assertChangelogTable(page: Page, version: (typeof versionsMock.versions)[number]) {
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

test('changes tab renders base case with static data', async ({ classificationDetailsPage }) => {
  const page = await openChangesTab(classificationDetailsPage, CHANGES_CLASSIFICATION_ID);

  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.getByRole('cell', { name: '120' })).toHaveCount(2);
  await expect(page.getByRole('cell', { name: 'Hviterussland' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Belarus' })).toBeVisible();
});

test('changes tab shows no data rows when no changes are found', async ({ classificationDetailsPage }) => {
  const page = await openChangesTab(classificationDetailsPage, NO_CHANGES_CLASSIFICATION_ID);

  await expect(page.getByText(localization.versions.noChanges)).toBeVisible();
  await expect(page.getByRole('table')).not.toBeVisible();

  await assertChangelogTable(page, currentVersion!);
});

test('changes tab groups rows by new code', async ({ classificationDetailsPage }) => {
  const page = await openChangesTab(classificationDetailsPage, CHANGES_CLASSIFICATION_ID);

  await expect(page.getByRole('cell', { name: '701' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '702' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '700' })).toHaveCount(1);
  await expect(page.getByRole('cell', { name: 'Samlet kode' })).toHaveCount(1);
});

test('changes tab renders newly created codes', async ({ classificationDetailsPage }) => {
  const page = await openChangesTab(classificationDetailsPage, CHANGES_CLASSIFICATION_ID);

  const createdRow = page.getByRole('row').filter({ has: page.getByRole('cell', { name: '990' }) });
  await expect(createdRow.getByRole('cell', { name: 'Ny kode' })).toBeVisible();
  await expect(createdRow.getByRole('cell', { name: '-' }).first()).toBeVisible();
});

test('changes tab renders deleted codes', async ({ classificationDetailsPage }) => {
  const page = await openChangesTab(classificationDetailsPage, CHANGES_CLASSIFICATION_ID);

  const deletedRow = page.getByRole('row').filter({ has: page.getByRole('cell', { name: '888' }) });
  await expect(deletedRow.getByRole('cell', { name: 'Utgatt kode' })).toBeVisible();
  await expect(deletedRow.getByRole('cell', { name: '-' }).first()).toBeVisible();
});
