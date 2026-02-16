import { test as base, expect, Page } from '@playwright/test';
import { tabsData } from '@/app/(services)/tabs';
import { localization } from '@/libs/language';
import {
  bankingAndFinancialMarked,
  companiesEnterprises,
  population,
  socialConditionsAndCrime,
  statusDraft,
  statusExternal,
  statusInternal,
  workAndPay,
} from './utils';

export const test = base.extend<{
  pageage: Page;
}>({
  page: async ({ page }, use) => {
    await page.goto(tabsData.VariableDefinitions.route);
    await expect(page).toHaveURL(/\/variable-definitions$/);
    await use(page);
  },
});

// TODO(cbi): Improve use of hardcoded values, these test depends on current testdata in norwegian nb [https://github.com/statisticsnorway/metadata-catalog-prototype/issues/106]
test('Filter by subject field displays tags (listitem) with count and close button (x)', async ({ page }) => {
  await expect(page.getByRole('main')).toContainText('76 treff');
  await page.waitForTimeout(200); // just to stabilize
  const checkbox = page.getByRole('checkbox', { name: socialConditionsAndCrime });

  await expect(checkbox).toBeVisible();
  await expect(checkbox).toBeEnabled();

  await expect(checkbox).toHaveAccessibleName(socialConditionsAndCrime);

  await checkbox.check();
  await expect(page.getByRole('main')).toContainText('2 treff');
  const filterTag = page.getByRole('listitem').filter({
    hasText: 'Sosiale forhold og kriminalitet (2)',
  });
  await expect(filterTag).toBeVisible();
  await page.getByRole('button', { name: 'Remove Sosiale forhold og kriminalitet (2)' }).click();
  await expect(page.getByRole('main')).toContainText('76 treff');
});

test('Select more than one filter display a "remove all" tag', async ({ page }) => {
  await expect(page.getByRole('main')).toContainText('76 treff');

  await page.waitForTimeout(200); // just to stabilize

  const filterOne = page.getByRole('checkbox', { name: workAndPay });
  const filterTwo = page.getByRole('checkbox', { name: population });

  await expect(filterOne).toBeVisible();
  await expect(filterOne).toBeEnabled();
  await expect(filterOne).toHaveAccessibleName(workAndPay);

  await filterOne.check();
  await expect(filterOne).toBeChecked();

  await expect(filterTwo).toBeVisible();
  await expect(filterTwo).toBeEnabled();

  await expect(filterTwo).toHaveAccessibleName(population);

  await filterTwo.check();
  await expect(filterTwo).toBeChecked();

  await expect(page.getByText('Fjern alle filter')).toBeVisible();
  await expect(page.getByRole('main')).toContainText('31 treff');
  await page.getByRole('button', { name: 'Remove Fjern alle filter' }).click();
  await expect(page.getByRole('main')).toContainText('76 treff');
});

test('Variable "Aksje" has two subject fields', async ({ page }) => {
  await expect(page.getByRole('main')).toContainText('76 treff');

  await page.waitForTimeout(200); // just to stabilize

  const filterOne = page.getByRole('checkbox', { name: bankingAndFinancialMarked });
  const filterTwo = page.getByRole('checkbox', { name: companiesEnterprises });

  await expect(filterOne).toBeVisible();
  await expect(filterOne).toBeEnabled();
  await expect(filterOne).toHaveAccessibleName(bankingAndFinancialMarked);
  await filterOne.check();

  await expect(filterOne).toBeChecked();
  await expect(page.getByRole('main')).toContainText('1 treff');
  await expect(page.getByRole('main')).toContainText('Aksjeaksje');

  await expect(filterTwo).toBeVisible();
  await expect(filterTwo).toBeEnabled();
  await expect(filterTwo).toHaveAccessibleName(companiesEnterprises);
  await filterTwo.check();

  await expect(filterOne).toBeChecked();
  await expect(page.getByRole('main')).toContainText('20 treff');
  await expect(page.getByRole('main')).toContainText('Aksjeaksje');

  await filterOne.uncheck();
  await expect(filterOne).not.toBeChecked();

  await expect(page.getByRole('main')).toContainText('20 treff');
  await expect(page.getByRole('main')).toContainText('Aksjeaksje');
});

test('Sort variable definitions', async ({ page }) => {
  await page.getByLabel(localization.search.sort.label).selectOption('titleDesc');
  await expect(page.getByRole('main')).toContainText('Årslønn');
  await page.getByLabel(localization.search.sort.label).selectOption('titleAsc');
  await expect(page.getByRole('main')).toContainText('Aksje');
  await page.getByLabel(localization.search.sort.label).selectOption('lastChanged');
  await expect(page.getByRole('main')).toContainText('Antall personer 18 år og over i husholdningen');
});

test('Filter by name', async ({ page }) => {
  await page.waitForTimeout(200); // just to stabilize
  await page.getByRole('complementary', { name: 'Filters' }).getByLabel('Søk', { exact: true }).click();
  await page.getByRole('checkbox', { name: 'Befolkning' }).check();
  await page.getByRole('complementary', { name: 'Filters' }).getByLabel('Søk', { exact: true }).fill('Baderom');
  await expect(page.getByRole('main')).toContainText('1 treff');
  await page.getByRole('button', { name: 'Remove Navn: Baderom' }).click();
  await expect(page.getByRole('main')).toContainText('25 treff');
});

test('Filter by name remove all', async ({ page }) => {
  await page.waitForTimeout(200); // just to stabilize
  await page.getByRole('checkbox', { name: population }).check();
  await page.getByRole('complementary', { name: 'Filters' }).getByLabel('Søk', { exact: true }).click();
  await page.getByRole('complementary', { name: 'Filters' }).getByLabel('Søk', { exact: true }).fill('Baderom');
  await expect(page.getByRole('main')).toContainText('1 treff');
  await page.getByRole('button', { name: 'Remove Fjern alle filter' }).click();
  await expect(page.getByRole('main')).toContainText('76 treff');
});

test('Filter by status draft', async ({ page }) => {
  await expect(page.getByRole('main')).toContainText('76 treff');
  await page.getByRole('checkbox', { name: statusDraft }).check();

  await expect(page.getByRole('main')).toContainText('73 treff');

  await expect(page.getByRole('button', { name: 'Remove Utkast (73)' })).toBeVisible();
  await page.getByRole('button', { name: 'Remove Utkast (73)' }).click();
  await expect(page.getByRole('main')).toContainText('76 treff');
});

test('Filter by status published', async ({ page }) => {
  await expect(page.getByRole('main')).toContainText('76 treff');
  const publishedInternalFilter = page.getByRole('checkbox', { name: statusInternal });

  await expect(publishedInternalFilter).toBeVisible();
  await publishedInternalFilter.check();

  await expect(publishedInternalFilter).toBeChecked();
  await expect(page.getByRole('main')).toContainText('2 treff');

  await page.getByRole('checkbox', { name: statusExternal }).check();
  await expect(page.getByRole('main')).toContainText('3 treff');

  await page.getByRole('button', { name: 'Remove Fjern alle filter' }).click();
  await expect(page.getByRole('main')).toContainText('76 treff');
});

test.describe('Variable definitions - pagination', () => {
  test.beforeEach(async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'Variabeldefinisjoner' })).toBeVisible();
  });

  test('Display 20 hits on first page and active page is 1', async ({ page }) => {
    const hits = page.getByTestId('vardef-search-card');
    await expect(hits).toHaveCount(20);
    await expect(page.getByTestId('page-active')).toHaveText('1');
  });
  test('Next/previous navigation keeps 20 hits', async ({ page }) => {
    await page.getByRole('button', { name: localization.next }).click();
    await expect(page.getByTestId('page-active')).toHaveText('2');
    await expect(page.getByTestId('vardef-search-card')).toHaveCount(20);
    await page.getByRole('button', { name: localization.previous }).click();
    await expect(page.getByTestId('page-active')).toHaveText('1');
    await expect(page.getByTestId('vardef-search-card')).toHaveCount(20);
  });
  test('Filter resets to page 1', async ({ page }) => {
    await page.getByRole('button', { name: localization.next }).click();
    await expect(page.getByTestId('page-active')).toHaveText('2');
    await page.getByRole('checkbox', { name: 'Befolkning' }).check();
    await expect(page.getByTestId('page-active')).toHaveText('1');
  });
  test('Sorting resets to page 1', async ({ page }) => {
    await page.getByRole('button', { name: localization.next }).click();
    await expect(page.getByTestId('page-active')).toHaveText('2');
    await page.getByLabel(localization.search.sort.label).selectOption('titleDesc');
    await expect(page.getByTestId('page-active')).toHaveText('1');
  });
  test('Behavior when no hits', async ({ page }) => {
    const searchInput = page.getByRole('complementary', { name: 'Filters' }).getByLabel('Søk', { exact: true });
    await searchInput.fill('asdasdasd');
    await expect(page.getByRole('main')).toContainText('Ditt søk ga ingen treff');
    await expect(page.getByTestId('pagination')).toHaveCount(0);
  });
});
