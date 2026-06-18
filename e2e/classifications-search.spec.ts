import { localization } from '@/libs/language';
import { expect, test } from './fixtures/classifications.fixture';
import searchResultsMock from '@/static-data/klass-search-results.json';
import { SearchResultResource } from '@/libs/data-access/klass';
import { Page } from '@playwright/test';
import { checkCheckbox } from './utils/commonUtils';

const searchTerm = 'Næring';
const searchTermVariant = 'næri';
const searchResults = searchResultsMock;

const companiesEnterprises = 'Bedrifter, foretak og regnskap';

const TOTAL_RESULTS_TEXT = '12 treff';
const FILTERED_RESULTS_TEXT = '3 treff';

const getLocators = (page: Page) => ({
  searchBox: page.getByRole('searchbox', { name: localization.search.label }),
  main: page.getByRole('main'),
  searchCards: page.getByTestId('search-card'),
  searchTag: (term: string) => page.getByRole('button', { name: `"${term}"` }),
});

test('Search box is visible', async ({ classificationsPage }) => {
  const { searchBox } = getLocators(classificationsPage);
  await expect(searchBox).toBeVisible();
});

test('Initial page shows all results', async ({ classificationsPage }) => {
  const { main } = getLocators(classificationsPage);
  await expect(main).toContainText(TOTAL_RESULTS_TEXT);
});

test.describe('When searching with a term', () => {
  test.beforeEach(async ({ classificationsPage }) => {
    const { searchBox } = getLocators(classificationsPage);
    await searchBox.fill(searchTerm);
  });

  test('returns filtered results', async ({ classificationsPage }) => {
    const { main, searchCards } = getLocators(classificationsPage);
    await expect(main).toContainText(FILTERED_RESULTS_TEXT);

    const firstSearchResult = searchCards.first();
    await expect(firstSearchResult).toBeVisible();
    await expect(firstSearchResult).toContainText(searchResults[0]!.name);
    await expect(firstSearchResult.getByRole('heading', { name: searchResults[0]!.name })).toContainText(searchTerm, {
      ignoreCase: true,
    });
  });

  test('displays a search tag', async ({ classificationsPage }) => {
    const { searchTag } = getLocators(classificationsPage);
    await expect(searchTag(searchTerm)).toBeVisible();
  });

  test('can remove search by clicking tag', async ({ classificationsPage }) => {
    const { main, searchTag } = getLocators(classificationsPage);
    await expect(main).toContainText(FILTERED_RESULTS_TEXT);

    await searchTag(searchTerm).click();

    await expect(searchTag(searchTerm)).not.toBeInViewport();
    await expect(main).toContainText(TOTAL_RESULTS_TEXT);
  });

  test('sorts results by search score', async ({ classificationsPage }) => {
    const { searchCards } = getLocators(classificationsPage);
    const maxScore = Math.max(...searchResults.map((r) => r.searchScore));
    const highestScoreResult: SearchResultResource = searchResults.find((r) => r.searchScore === maxScore)!;

    await expect(searchCards.first().getByRole('heading', { name: highestScoreResult.name })).toBeVisible();
  });

  test('only contains nb language results', async ({ classificationsPage }) => {
    const { searchCards } = getLocators(classificationsPage);
    const excludedNnText = 'Kodeliste for måleeiningar';

    const count = await searchCards.count();
    for (let i = 0; i < count; i++) {
      await expect(searchCards.nth(i)).not.toContainText(excludedNnText);
    }
  });
});

test('search term variant returns same results', async ({ classificationsPage }) => {
  const { searchBox } = getLocators(classificationsPage);
  await searchBox.fill(searchTermVariant);
  const { main } = getLocators(classificationsPage);
  await expect(main).toContainText(FILTERED_RESULTS_TEXT);
});

test('Search result can be sorted by different criteria', async ({ classificationsPage }) => {
  // After initial sort by search score the result can be sorted by asc/desc
});

test('Search result can be filtered by type', async ({ classificationsPage }) => {
  // search result can be filtered by type
  //
  await checkCheckbox(classificationsPage.getByRole('checkbox', { name: 'Klassifikasjon' }));
  await checkCheckbox(classificationsPage.getByRole('checkbox', { name: 'Kodeliste' }));
});

test('Search result can be filtered by subject', async ({ classificationsPage }) => {
  await checkCheckbox(classificationsPage.getByRole('checkbox', { name: companiesEnterprises }));
});
