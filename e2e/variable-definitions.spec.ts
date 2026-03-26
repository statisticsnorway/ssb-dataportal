import { localization } from '@/libs/language';
import { expect, test } from './fixtures/variableDefinitions.fixture';
import { checkCheckbox } from './utils/commonUtils';
import { statuses, variables } from './utils/variables';

test('Filter by subject field displays tags (listitem) with count and close button (x)', async ({
  variableDefinitionsPage,
}) => {
  const main = variableDefinitionsPage.getByRole('main');
  await expect(main).toContainText(variables.totalHits);
  const checkbox = variableDefinitionsPage.getByRole('checkbox', { name: variables.socialConditionsAndCrime });
  await checkCheckbox(checkbox);

  await expect(main).toContainText('2 treff');
  const filterTag = variableDefinitionsPage.getByRole('listitem').filter({
    hasText: variables.socialConditionsAndCrime,
  });
  await expect(filterTag).toBeVisible();
  await variableDefinitionsPage.getByRole('button', { name: `Remove ${variables.socialConditionsAndCrime}` }).click();
  await expect(main).toContainText(variables.totalHits);
});

test('Select more than one filter display a "remove all" tag', async ({ variableDefinitionsPage }) => {
  const main = variableDefinitionsPage.getByRole('main');
  await expect(main).toContainText(variables.totalHits);

  const filterOne = variableDefinitionsPage.getByRole('checkbox', { name: variables.workAndPay });

  await checkCheckbox(filterOne);

  const filterTwo = variableDefinitionsPage.getByRole('checkbox', { name: variables.population });
  await checkCheckbox(filterTwo);

  await expect(main).toContainText(variables.workAndPayPlusPopulationHits);
  const removeAllButton = variableDefinitionsPage.getByRole('button', { name: localization.button.removeFilter });
  await removeAllButton.click();
  await expect(main).toContainText(variables.totalHits);
});

test('Subject area level 2 filters on level 1', async ({ variableDefinitionsPage }) => {
  const main = variableDefinitionsPage.getByRole('main');
  await expect(main).toContainText(variables.totalHits);
  const checkbox = variableDefinitionsPage.getByRole('checkbox', { name: variables.health.label });

  await checkCheckbox(checkbox);

  const levelTwoTag = variableDefinitionsPage.getByRole('list').filter({ hasText: variables.health.tagLevelTwo });
  await expect(levelTwoTag).toBeVisible();
  await expect(levelTwoTag).toContainText(variables.health.tagLevelTwo);

  const levelOneTag = variableDefinitionsPage
    .getByRole('list')
    .filter({ hasText: new RegExp(`^${variables.health.tagLevelOne}$`) });
  await expect(levelOneTag).toBeVisible();
  await expect(levelOneTag).toContainText(new RegExp(variables.health.tagLevelOne));
});

test('Variable "Aksje" has two subject fields', async ({ variableDefinitionsPage }) => {
  const main = variableDefinitionsPage.getByRole('main');
  await expect(main).toContainText(variables.totalHits);

  const filterOne = variableDefinitionsPage.getByRole('checkbox', { name: variables.bankingAndFinancialMarket });
  const filterTwo = variableDefinitionsPage.getByRole('checkbox', { name: variables.companiesEnterprises });

  await checkCheckbox(filterOne);

  await expect(main).toContainText('1 treff');
  await expect(main).toContainText('Aksjeaksje');

  await checkCheckbox(filterTwo);

  await expect(main).toContainText('20 treff');
  await expect(main).toContainText('Aksjeaksje');

  await filterOne.uncheck();
  await expect(filterOne).not.toBeChecked();

  await expect(main).toContainText('20 treff');
  await expect(main).toContainText('Aksjeaksje');
});

test('Sort variable definitions', async ({ variableDefinitionsPage }) => {
  const main = variableDefinitionsPage.getByRole('main');
  await main.getByLabel(localization.search.sort.label).selectOption('titleDesc');
  await expect(main).toContainText('Årslønn');
  await main.getByLabel(localization.search.sort.label).selectOption('titleAsc');
  await expect(main).toContainText('Aksje');
  await main.getByLabel(localization.search.sort.label).selectOption('lastChanged');
  await expect(main).toContainText('Antall personer 18 år og over i husholdningen');
});

test('Filter by name', async ({ variableDefinitionsPage }) => {
  const main = variableDefinitionsPage.getByRole('main');
  await variableDefinitionsPage
    .getByRole('complementary', { name: 'Filters' })
    .getByLabel('Søk', { exact: true })
    .click();
  await variableDefinitionsPage.getByRole('checkbox', { name: 'Befolkning' }).check();
  await variableDefinitionsPage
    .getByRole('complementary', { name: 'Filters' })
    .getByLabel('Søk', { exact: true })
    .fill('Baderom');
  await expect(main).toContainText('1 treff');
  await variableDefinitionsPage.getByRole('button', { name: 'Remove Navn: Baderom' }).click();
  await expect(main).toContainText('25 treff');
});

test('Filter by name remove all', async ({ variableDefinitionsPage }) => {
  const main = variableDefinitionsPage.getByRole('main');
  await variableDefinitionsPage.getByRole('checkbox', { name: variables.population }).check();
  await variableDefinitionsPage
    .getByRole('complementary', { name: 'Filters' })
    .getByLabel('Søk', { exact: true })
    .click();
  await variableDefinitionsPage
    .getByRole('complementary', { name: 'Filters' })
    .getByLabel('Søk', { exact: true })
    .fill('Baderom');
  await expect(main).toContainText('1 treff');
  await variableDefinitionsPage.getByRole('button', { name: `Remove ${localization.button.removeFilter}` }).click();
  await expect(main).toContainText(variables.totalHits);
});

test('Filter by status draft', async ({ variableDefinitionsPage }) => {
  const main = variableDefinitionsPage.getByRole('main');
  await expect(main).toContainText(variables.totalHits);
  const draftFilter = variableDefinitionsPage.getByRole('checkbox', { name: statuses.draft.label });

  await expect(draftFilter).toBeVisible();
  await expect(draftFilter).toBeEnabled();
  await draftFilter.check();

  await expect(main).toContainText(statuses.draft.totalHits);

  const button = variableDefinitionsPage.getByRole('button', { name: statuses.draft.removeLabel });
  await expect(button).toBeVisible();
  await button.click();
  await expect(main).toContainText(variables.totalHits);
});

test('Filter by status published', async ({ variableDefinitionsPage }) => {
  const main = variableDefinitionsPage.getByRole('main');
  await expect(main).toContainText(variables.totalHits);
  const publishedInternalFilter = variableDefinitionsPage.getByRole('checkbox', { name: statuses.internal.label });
  const publishedExternalFilter = variableDefinitionsPage.getByRole('checkbox', { name: statuses.external.label });

  await checkCheckbox(publishedInternalFilter);

  await expect(main).toContainText(statuses.internal.totalHits);

  await checkCheckbox(publishedExternalFilter);

  await expect(main).toContainText(statuses.internalPlusExternal.totalHits);

  await variableDefinitionsPage.getByRole('button', { name: `Remove ${localization.button.removeFilter}` }).click();
  await expect(main).toContainText(variables.totalHits);
});

test.describe('Variable definitions - pagination', () => {
  test('Display 8 hits on first page and active page is 1', async ({ variableDefinitionsPage }) => {
    const hits = variableDefinitionsPage.getByTestId('vardef-search-card');
    await expect(hits).toHaveCount(8);
    await expect(variableDefinitionsPage.getByTestId('page-active')).toHaveText('1');
  });
  test('Next/previous navigation keeps 8 hits', async ({ variableDefinitionsPage }) => {
    await variableDefinitionsPage.getByRole('button', { name: localization.next }).click();
    await expect(variableDefinitionsPage.getByTestId('page-active')).toHaveText('2');
    await expect(variableDefinitionsPage.getByTestId('vardef-search-card')).toHaveCount(8);
    await variableDefinitionsPage.getByRole('button', { name: localization.previous }).click();
    await expect(variableDefinitionsPage.getByTestId('page-active')).toHaveText('1');
    await expect(variableDefinitionsPage.getByTestId('vardef-search-card')).toHaveCount(8);
  });
  test('Filter resets to page 1', async ({ variableDefinitionsPage }) => {
    await variableDefinitionsPage.getByRole('button', { name: localization.next }).click();
    await expect(variableDefinitionsPage.getByTestId('page-active')).toHaveText('2');
    await variableDefinitionsPage.getByRole('checkbox', { name: 'Befolkning' }).check();
    await expect(variableDefinitionsPage.getByTestId('page-active')).toHaveText('1');
  });
  test('Sorting resets to page 1', async ({ variableDefinitionsPage }) => {
    await variableDefinitionsPage.getByRole('button', { name: localization.next }).click();
    await expect(variableDefinitionsPage.getByTestId('page-active')).toHaveText('2');
    await variableDefinitionsPage.getByLabel(localization.search.sort.label).selectOption('titleDesc');
    await expect(variableDefinitionsPage.getByTestId('page-active')).toHaveText('1');
  });
  test('Behavior when no hits', async ({ variableDefinitionsPage }) => {
    const searchInput = variableDefinitionsPage
      .getByRole('complementary', { name: 'Filters' })
      .getByLabel('Søk', { exact: true });
    await searchInput.fill('asdasdasd');
    await expect(variableDefinitionsPage.getByRole('main')).toContainText('Ditt søk ga ingen treff');
    await expect(variableDefinitionsPage.getByTestId('pagination')).toHaveCount(0);
  });
});
