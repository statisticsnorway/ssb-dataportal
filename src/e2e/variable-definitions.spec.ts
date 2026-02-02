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
  await expect(page.locator('[id="filter-Statistikkområde"]')).toContainText('Sosiale forhold og kriminalitet');
  await page.getByRole('checkbox', { name: 'Sosiale forhold og' }).check();
  await expect(page.getByRole('main')).toContainText('2 treff');
  await expect(page.getByText('Sosiale forhold og kriminalitet (2)x')).toBeVisible();
  await page.getByRole('button', { name: 'x', exact: true }).click();
  await expect(page.getByRole('main')).toContainText('76 treff');
});

test('Select more than one filter display a "remove all" tag', async ({ page }) => {
  await page.goto(tabsData.VariableDefinitions.route);
  await expect(page.getByRole('main')).toContainText('76 treff');
  await page.getByRole('checkbox', { name: 'Arbeid og lønn' }).check();
  await page.getByRole('checkbox', { name: 'Befolkning' }).check();
  await expect(page.locator('body')).toContainText('Fjern alle filterx');
  await expect(page.getByRole('main')).toContainText('31 treff');
  await page.getByRole('listitem').filter({ hasText: 'Fjern alle filterx' }).getByRole('button').click();
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
