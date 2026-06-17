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
  await variableDefinitionsPage
    .getByRole('button', { name: `${localization.filterTag.remove} ${variables.socialConditionsAndCrime}` })
    .click();
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
  await expect(main).toContainText('Aksje');

  await checkCheckbox(filterTwo);

  await expect(main).toContainText('20 treff');
  await expect(main).toContainText('Aksje');

  await filterOne.uncheck();
  await expect(filterOne).not.toBeChecked();

  await expect(main).toContainText('20 treff');
  await expect(main).toContainText('Aksje');
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
    .getByRole('searchbox', {
      name: localization.search.textFilter.label,
    })
    .click();
  await variableDefinitionsPage.getByRole('checkbox', { name: 'Befolkning' }).check();
  await variableDefinitionsPage
    .getByRole('complementary', { name: 'Filters' })
    .getByRole('searchbox', {
      name: localization.search.textFilter.label,
    })
    .fill('Baderom');
  await expect(main).toContainText('1 treff');
  await variableDefinitionsPage.getByRole('button', { name: 'Fjern Navn: Baderom' }).click();
  await expect(main).toContainText('25 treff');
});

test('Filter by name remove all', async ({ variableDefinitionsPage }) => {
  const main = variableDefinitionsPage.getByRole('main');
  await variableDefinitionsPage.getByRole('checkbox', { name: variables.population }).check();
  await variableDefinitionsPage
    .getByRole('complementary', { name: 'Filters' })
    .getByRole('searchbox', {
      name: localization.search.textFilter.label,
    })
    .click();
  await variableDefinitionsPage
    .getByRole('complementary', { name: 'Filters' })
    .getByRole('searchbox', {
      name: localization.search.textFilter.label,
    })
    .fill('Baderom');
  await expect(main).toContainText('1 treff');
  await variableDefinitionsPage
    .getByRole('button', { name: `${localization.filterTag.remove} ${localization.button.removeFilter}` })
    .click();
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

  await variableDefinitionsPage
    .getByRole('button', { name: `${localization.filterTag.remove} ${localization.button.removeFilter}` })
    .click();
  await expect(main).toContainText(variables.totalHits);
});

test.describe('Variable definitions - pagination', () => {
  test('Display 8 hits on first page and active page is 1', async ({ variableDefinitionsPage }) => {
    const hits = variableDefinitionsPage.getByTestId('search-card');
    await expect(hits).toHaveCount(8);
    await expect(variableDefinitionsPage.getByTestId('page-active')).toHaveText('1');
  });
  test('Next/previous navigation keeps 8 hits', async ({ variableDefinitionsPage }) => {
    await variableDefinitionsPage.getByRole('button', { name: localization.next }).click();
    await expect(variableDefinitionsPage.getByTestId('page-active')).toHaveText('2');
    await expect(variableDefinitionsPage.getByTestId('search-card')).toHaveCount(8);
    await variableDefinitionsPage.getByRole('button', { name: localization.previous }).click();
    await expect(variableDefinitionsPage.getByTestId('page-active')).toHaveText('1');
    await expect(variableDefinitionsPage.getByTestId('search-card')).toHaveCount(8);
  });
  test('Filter resets to page 1', async ({ variableDefinitionsPage }) => {
    await variableDefinitionsPage.getByRole('button', { name: localization.next }).click();
    await expect(variableDefinitionsPage.getByTestId('page-active')).toHaveText('2');
    await variableDefinitionsPage.getByRole('checkbox', { name: 'Befolkning' }).check();
    await expect(variableDefinitionsPage.getByTestId('page-active')).toHaveText('1');
    await expect(variableDefinitionsPage).not.toHaveURL(/[?&]page=/);
  });
  test('Sorting resets to page 1', async ({ variableDefinitionsPage }) => {
    await variableDefinitionsPage.getByRole('button', { name: localization.next }).click();
    await expect(variableDefinitionsPage.getByTestId('page-active')).toHaveText('2');
    await variableDefinitionsPage.getByLabel(localization.search.sort.label).selectOption('titleDesc');
    await expect(variableDefinitionsPage.getByTestId('page-active')).toHaveText('1');
    await expect(variableDefinitionsPage).not.toHaveURL(/[?&]page=/);
  });
  test('Behavior when no hits', async ({ variableDefinitionsPage }) => {
    const searchInput = variableDefinitionsPage.getByRole('complementary', { name: 'Filters' }).getByRole('searchbox', {
      name: localization.search.textFilter.label,
    });
    await searchInput.fill('asdasdasd');
    await expect(variableDefinitionsPage.getByRole('main')).toContainText('Ditt søk ga ingen treff');
    await expect(variableDefinitionsPage.getByTestId('pagination')).toHaveCount(0);
  });
});

test.describe('Variable definitions URL state', () => {
  test('updates URL when filtering by name', async ({ variableDefinitionsPage }) => {
    await variableDefinitionsPage
      .getByRole('complementary', { name: 'Filters' })
      .getByRole('searchbox', {
        name: localization.search.textFilter.label,
      })
      .fill('Baderom');
    await expect(variableDefinitionsPage).toHaveURL(/[?&]q=Baderom/);
    await expect(variableDefinitionsPage).not.toHaveURL(/[?&]page=/);
    await expect(variableDefinitionsPage.getByRole('main')).toContainText('1 treff');
  });

  test('updates URL when selecting status filter', async ({ variableDefinitionsPage }) => {
    await variableDefinitionsPage.getByRole('checkbox', { name: statuses.draft.label }).check();
    await expect(variableDefinitionsPage).toHaveURL(/[?&]status=DRAFT/);
    await expect(variableDefinitionsPage).not.toHaveURL(/[?&]page=/);
    await expect(variableDefinitionsPage.getByRole('main')).toContainText(statuses.draft.totalHits);
  });

  test('updates URL when selecting subject filter', async ({ variableDefinitionsPage }) => {
    await variableDefinitionsPage.getByRole('checkbox', { name: variables.workAndPay }).check();
    await expect(variableDefinitionsPage).toHaveURL(/[?&]subjects=al/);
    await expect(variableDefinitionsPage).not.toHaveURL(/[?&]page=/);
  });

  test('updates URL when sorting', async ({ variableDefinitionsPage }) => {
    await variableDefinitionsPage.getByLabel(localization.search.sort.label).selectOption('titleDesc');
    await expect(variableDefinitionsPage).toHaveURL(/[?&]sort=titleDesc/);
    await expect(variableDefinitionsPage).not.toHaveURL(/[?&]page=/);
    await expect(variableDefinitionsPage.getByRole('main')).toContainText('Årslønn');
  });

  test('updates URL when changing page', async ({ variableDefinitionsPage }) => {
    await variableDefinitionsPage.getByRole('button', { name: localization.next }).click();
    await expect(variableDefinitionsPage).toHaveURL(/[?&]page=2/);
    await expect(variableDefinitionsPage.getByTestId('page-active')).toHaveText('2');
  });

  test('filtering from page 2 resets page parameter', async ({ variableDefinitionsPage }) => {
    await variableDefinitionsPage.getByRole('button', { name: localization.next }).click();
    await expect(variableDefinitionsPage).toHaveURL(/[?&]page=2/);
    await expect(variableDefinitionsPage.getByTestId('page-active')).toHaveText('2');
    await variableDefinitionsPage.getByRole('checkbox', { name: variables.population }).check();
    await expect(variableDefinitionsPage).toHaveURL(/[?&]subjects=be/);
    await expect(variableDefinitionsPage).not.toHaveURL(/[?&]page=/);
    await expect(variableDefinitionsPage.getByTestId('page-active')).toHaveText('1');
  });

  test('sorting from page 2 resets page parameter', async ({ variableDefinitionsPage }) => {
    await variableDefinitionsPage.getByRole('button', { name: localization.next }).click();
    await expect(variableDefinitionsPage).toHaveURL(/[?&]page=2/);
    await expect(variableDefinitionsPage.getByTestId('page-active')).toHaveText('2');
    await variableDefinitionsPage.getByLabel(localization.search.sort.label).selectOption('titleDesc');
    await expect(variableDefinitionsPage).toHaveURL(/[?&]sort=titleDesc/);
    await expect(variableDefinitionsPage).not.toHaveURL(/[?&]page=/);
    await expect(variableDefinitionsPage.getByTestId('page-active')).toHaveText('1');
  });

  test('hydrates UI from shared URL', async ({ variableDefinitionsPage }) => {
    await variableDefinitionsPage.goto('/variable-definitions?q=Baderom&subjects=be&sort=titleDesc');
    await expect(
      variableDefinitionsPage.getByRole('complementary', { name: 'Filters' }).getByRole('searchbox', {
        name: localization.search.textFilter.label,
      }),
    ).toHaveValue('Baderom');
    await expect(variableDefinitionsPage.getByRole('checkbox', { name: variables.population })).toBeChecked();
    await expect(variableDefinitionsPage.getByLabel(localization.search.sort.label)).toHaveValue('titleDesc');
    await expect(variableDefinitionsPage.getByRole('main')).toContainText('1 treff');
  });

  test('keeps URL state after refresh', async ({ variableDefinitionsPage }) => {
    await variableDefinitionsPage.goto('/variable-definitions?q=Baderom&subjects=be&sort=titleDesc');
    await variableDefinitionsPage.reload();
    await expect(
      variableDefinitionsPage
        .getByRole('complementary', { name: 'Filters' })
        .getByRole('searchbox', { name: localization.search.textFilter.label }),
    ).toHaveValue('Baderom');
    await expect(variableDefinitionsPage.getByRole('checkbox', { name: variables.population })).toBeChecked();
    await expect(variableDefinitionsPage.getByLabel(localization.search.sort.label)).toHaveValue('titleDesc');
    await expect(variableDefinitionsPage).toHaveURL(/[?&]q=Baderom/);
    await expect(variableDefinitionsPage).toHaveURL(/[?&]subjects=be/);
    await expect(variableDefinitionsPage).toHaveURL(/[?&]sort=titleDesc/);
  });

  test('hydrates shared URL with search, filters and sorting', async ({ variableDefinitionsPage }) => {
    await variableDefinitionsPage.goto('/variable-definitions?q=inntekt&subjects=al&status=DRAFT&sort=titleDesc');
    await expect(
      variableDefinitionsPage.getByRole('complementary', { name: 'Filters' }).getByRole('searchbox', {
        name: localization.search.textFilter.label,
      }),
    ).toHaveValue('inntekt');
    await expect(variableDefinitionsPage.getByRole('checkbox', { name: statuses.draft.label })).toBeChecked();
    await expect(variableDefinitionsPage.getByRole('checkbox', { name: variables.workAndPay })).toBeChecked();
    await expect(variableDefinitionsPage.getByLabel(localization.search.sort.label)).toHaveValue('titleDesc');
    await expect(variableDefinitionsPage).toHaveURL(/[?&]q=inntekt/);
    await expect(variableDefinitionsPage).toHaveURL(/[?&]subjects=al/);
    await expect(variableDefinitionsPage).toHaveURL(/[?&]status=DRAFT/);
    await expect(variableDefinitionsPage).toHaveURL(/[?&]sort=titleDesc/);
    await expect(variableDefinitionsPage.getByRole('main')).toContainText(/treff/);
  });

  test('hydrates page from shared URL', async ({ variableDefinitionsPage }) => {
    await variableDefinitionsPage.goto('/variable-definitions?page=2');
    await expect(variableDefinitionsPage.getByTestId('page-active')).toHaveText('2');
    await expect(variableDefinitionsPage).toHaveURL(/[?&]page=2/);
    await expect(variableDefinitionsPage.getByTestId('search-card')).toHaveCount(8);
  });
});
