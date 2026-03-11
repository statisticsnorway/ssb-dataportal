import { test as base, expect, Locator, Page } from '@playwright/test';
import { tabsData } from '@/app/(services)/tabs';
import { localization } from '@/libs/language';
import { statuses, variables } from './variables';

export const test = base.extend<{
  pageage: Page;
}>({
  page: async ({ page }, use) => {
    await page.goto(tabsData.VariableDefinitions.route);
    await expect(page).toHaveURL(/\/variable-definitions$/);
    await use(page);
  },
});

async function checkCheckbox(checkboxLocator: Locator, expectedName: string) {
  await expect(checkboxLocator).toBeVisible();
  await expect(checkboxLocator).toBeEnabled();
  await expect(checkboxLocator).toHaveAccessibleName(expectedName);
  await checkboxLocator.check();
  await expect(checkboxLocator).toBeChecked();
}

// await page.waitForTimeout(200); to stabilize tests
test('Filter by subject field displays tags (listitem) with count and close button (x)', async ({ page }) => {
  const main = page.getByRole('main');
  await expect(main).toContainText(variables.totalHits);
  const checkbox = page.getByRole('checkbox', { name: variables.socialConditionsAndCrime });
  await page.waitForTimeout(200);
  await checkCheckbox(checkbox, variables.socialConditionsAndCrime);

  await expect(main).toContainText('2 treff');
  const filterTag = page.getByRole('listitem').filter({
    hasText: variables.socialConditionsAndCrime,
  });
  await expect(filterTag).toBeVisible();
  await page.getByRole('button', { name: `Remove ${variables.socialConditionsAndCrime}` }).click();
  await expect(main).toContainText(variables.totalHits);
});

test('Select more than one filter display a "remove all" tag', async ({ page }) => {
  const main = page.getByRole('main');
  await expect(main).toContainText(variables.totalHits);

  await page.waitForTimeout(200);

  const filterOne = page.getByRole('checkbox', { name: variables.workAndPay });

  await checkCheckbox(filterOne, variables.workAndPay);

  const filterTwo = page.getByRole('checkbox', { name: variables.population });
  await checkCheckbox(filterTwo, variables.population);

  await expect(main).toContainText(variables.workAndPayPlusPopulationHits);
  const removeAllButton = page.getByRole('button', { name: localization.button.removeFilter });
  await removeAllButton.click();
  await expect(main).toContainText(variables.totalHits);
});

test('Subject area level 2 filters on level 1', async ({ page }) => {
  await page.waitForTimeout(200);

  const checkbox = page.getByRole('checkbox', { name: variables.health.label });

  await checkCheckbox(checkbox, variables.health.label);

  const levelTwoTag = page.getByRole('list').filter({ hasText: variables.health.tagLevelTwo });
  await expect(levelTwoTag).toBeVisible();
  await expect(levelTwoTag).toContainText(variables.health.tagLevelTwo);

  const levelOneTag = page.getByRole('list').filter({ hasText: new RegExp(`^${variables.health.tagLevelOne}$`) });
  await expect(levelOneTag).toBeVisible();
  await expect(levelOneTag).toContainText(new RegExp(variables.health.tagLevelOne));
});

test('Variable "Aksje" has two subject fields', async ({ page }) => {
  const main = page.getByRole('main');
  await expect(main).toContainText(variables.totalHits);

  await page.waitForTimeout(200);

  const filterOne = page.getByRole('checkbox', { name: variables.bankingAndFinancialMarket });
  const filterTwo = page.getByRole('checkbox', { name: variables.companiesEnterprises });

  await checkCheckbox(filterOne, variables.bankingAndFinancialMarket);

  await expect(main).toContainText('1 treff');
  await expect(main).toContainText('Aksjeaksje');

  await checkCheckbox(filterTwo, variables.companiesEnterprises);

  await expect(main).toContainText('20 treff');
  await expect(main).toContainText('Aksjeaksje');

  await filterOne.uncheck();
  await expect(filterOne).not.toBeChecked();

  await expect(main).toContainText('20 treff');
  await expect(main).toContainText('Aksjeaksje');
});

test('Sort variable definitions', async ({ page }) => {
  const main = page.getByRole('main');
  await main.getByLabel(localization.search.sort.label).selectOption('titleDesc');
  await expect(main).toContainText('Årslønn');
  await main.getByLabel(localization.search.sort.label).selectOption('titleAsc');
  await expect(main).toContainText('Aksje');
  await main.getByLabel(localization.search.sort.label).selectOption('lastChanged');
  await expect(main).toContainText('Antall personer 18 år og over i husholdningen');
});

test('Filter by name', async ({ page }) => {
  const main = page.getByRole('main');
  await page.waitForTimeout(200);
  await page.getByRole('complementary', { name: 'Filters' }).getByLabel('Søk', { exact: true }).click();
  await page.getByRole('checkbox', { name: 'Befolkning' }).check();
  await page.getByRole('complementary', { name: 'Filters' }).getByLabel('Søk', { exact: true }).fill('Baderom');
  await expect(main).toContainText('1 treff');
  await page.getByRole('button', { name: 'Remove Navn: Baderom' }).click();
  await expect(main).toContainText('25 treff');
});

test('Filter by name remove all', async ({ page }) => {
  const main = page.getByRole('main');
  await page.waitForTimeout(200);
  await page.getByRole('checkbox', { name: variables.population }).check();
  await page.getByRole('complementary', { name: 'Filters' }).getByLabel('Søk', { exact: true }).click();
  await page.getByRole('complementary', { name: 'Filters' }).getByLabel('Søk', { exact: true }).fill('Baderom');
  await expect(main).toContainText('1 treff');
  await page.getByRole('button', { name: `Remove ${localization.button.removeFilter}` }).click();
  await expect(main).toContainText(variables.totalHits);
});

test('Filter by status draft', async ({ page }) => {
  const main = page.getByRole('main');
  await expect(main).toContainText(variables.totalHits);
  await page.waitForTimeout(200);
  const draftFilter = page.getByRole('checkbox', { name: statuses.draft.label });

  await expect(draftFilter).toBeVisible();
  await expect(draftFilter).toBeEnabled();
  await draftFilter.check();

  await expect(main).toContainText(statuses.draft.totalHits);

  const button = page.getByRole('button', { name: statuses.draft.removeLabel });
  await expect(button).toBeVisible();
  await button.click();
  await expect(main).toContainText(variables.totalHits);
});

test('Filter by status published', async ({ page }) => {
  const main = page.getByRole('main');
  await expect(main).toContainText(variables.totalHits);
  await page.waitForTimeout(200);
  const publishedInternalFilter = page.getByRole('checkbox', { name: statuses.internal.label });
  const publishedExternalFilter = page.getByRole('checkbox', { name: statuses.external.label });

  await checkCheckbox(publishedInternalFilter, statuses.internal.label);

  await expect(main).toContainText(statuses.internal.totalHits);

  await checkCheckbox(publishedExternalFilter, statuses.external.label);

  await expect(main).toContainText(statuses.internalPlusExternal.totalHits);

  await page.getByRole('button', { name: `Remove ${localization.button.removeFilter}` }).click();
  await expect(main).toContainText(variables.totalHits);
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
