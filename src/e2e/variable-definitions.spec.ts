import { expect, test } from '@playwright/test';
import { tabsData } from '@/app/(services)/tabs';
import { localization } from '@/libs/language';

// TODO(cbi): Improve use of hardcoded values, these test depends on current testdata in norwegian nb [https://github.com/statisticsnorway/metadata-catalog-prototype/issues/106]
test.describe('Navigation variable definitions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/variable-definitions');
    await expect(page).toHaveURL(/\/variable-definitions$/);
  });
});

test('Filter by subject field displays tags (listitem) with count and close button (x)', async ({ page }) => {
  await page.goto(tabsData.VariableDefinitions.route);
  await expect(page.getByRole('main')).toContainText('76 treff');
  await expect(page.getByRole('checkbox', { name: 'Sosiale forhold og' })).toBeVisible();
  await page.getByRole('checkbox', { name: 'Sosiale forhold og' }).check();
  await expect(page.getByRole('main')).toContainText('2 treff');
  const filterTag = page.getByRole('listitem').filter({
    hasText: 'Sosiale forhold og kriminalitet (2)',
  });
  await expect(filterTag).toBeVisible();
  await page.getByRole('button', { name: 'Remove Sosiale forhold og kriminalitet (2)' }).click();
  await expect(page.getByRole('main')).toContainText('76 treff');
});

test('Select more than one filter display a "remove all" tag', async ({ page }) => {
  await page.goto(tabsData.VariableDefinitions.route);
  await expect(page.getByRole('main')).toContainText('76 treff');
  await page.getByRole('checkbox', { name: 'Arbeid og lønn' }).check();
  await page.getByRole('checkbox', { name: 'Befolkning' }).check();
  await expect(page.getByText('Fjern alle filter')).toBeVisible();
  await expect(page.getByRole('main')).toContainText('31 treff');
  await page.getByRole('button', { name: 'Remove Fjern alle filter' }).click();
  await expect(page.getByRole('main')).toContainText('76 treff');
});

test('Variable "Aksje" has two subject fields', async ({ page }) => {
  await page.goto(tabsData.VariableDefinitions.route);
  await expect(page.getByRole('main')).toContainText('76 treff');
  await page.getByRole('checkbox', { name: 'Bank og finansmarked' }).check();
  await expect(page.getByRole('main')).toContainText('1 treff');
  await expect(page.getByRole('main')).toContainText('Aksjeaksje');
  await page.getByRole('checkbox', { name: 'Bedrifter, foretak og regnskap' }).check();
  await expect(page.getByRole('main')).toContainText('20 treff');
  await expect(page.getByRole('main')).toContainText('Aksjeaksje');
  await page.getByRole('checkbox', { name: 'Bank og finansmarked' }).uncheck();
  await expect(page.getByRole('main')).toContainText('20 treff');
  await expect(page.getByRole('main')).toContainText('Aksjeaksje');
});

test('Sort variable definitions', async ({ page }) => {
  await page.goto(tabsData.VariableDefinitions.route);
  await page.getByLabel(localization.search.sort.label).selectOption('titleDesc');
  await expect(page.getByRole('main')).toContainText('Årslønn');
  await page.getByLabel(localization.search.sort.label).selectOption('titleAsc');
  await expect(page.getByRole('main')).toContainText('Aksje');
  await page.getByLabel(localization.search.sort.label).selectOption('lastChanged');
  await expect(
    page.getByText('Antall personer 18 år og over i husholdningenpers18plus_i_hushnrAntall personer'),
  ).toBeVisible();
});
test('Filter by name', async ({ page }) => {
  await page.goto(tabsData.VariableDefinitions.route);
  await page.getByRole('complementary', { name: 'Filters' }).getByLabel('Søk', { exact: true }).click();
  await page.getByRole('checkbox', { name: 'Befolkning' }).check();
  await page.getByRole('complementary', { name: 'Filters' }).getByLabel('Søk', { exact: true }).fill('Baderom');
  await expect(page.getByRole('main')).toContainText('1 treff');
  await page.getByRole('button', { name: 'Remove Navn: Baderom' }).click();
  await expect(page.getByRole('main')).toContainText('25 treff');
});

test('Filter by name remove all', async ({ page }) => {
  await page.goto(tabsData.VariableDefinitions.route);
  await page.getByRole('checkbox', { name: 'Befolkning' }).check();
  await page.getByRole('complementary', { name: 'Filters' }).getByLabel('Søk', { exact: true }).click();
  await page.getByRole('complementary', { name: 'Filters' }).getByLabel('Søk', { exact: true }).fill('Baderom');
  await expect(page.getByRole('main')).toContainText('1 treff');
  await page.getByRole('button', { name: 'Remove Fjern alle filter' }).click();
  await expect(page.getByRole('main')).toContainText('76 treff');
});
