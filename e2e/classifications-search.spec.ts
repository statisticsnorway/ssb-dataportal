import { localization } from '@/libs/language';
import { expect, test } from './fixtures/classifications.fixture';
import searchResultsMock from '@/static-data/klass-search-results.json';
import { SearchResultResource } from '@/libs/data-access/klass';
import { Page } from '@playwright/test';
import { checkCheckbox, expandFilterGroups } from './utils/commonUtils';
import { CODELIST, REMOVE_STANDARD, STANDARD } from './utils/variables';
import { stripTitlePrefix } from '@/utils/classifications/classificationHelpers';
import { stabilize } from './utils/commonUtils';

const searchTerm = 'Næring';
const searchTermVariant = 'næri';
const searchResults = searchResultsMock;

const companiesEnterprises = 'Bedrifter, foretak og regnskap';

const TOTAL_RESULTS_TEXT = /Antall treff: 12(?!\d)/;
const FILTERED_RESULTS_TEXT = /Antall treff: 1(?!\d)/;
const ONE_RESULT_TEXT = /Antall treff: 1(?!\d)/;
const TWO_RESULTS_TEXT = /Antall treff: 2(?!\d)/;

const getLocators = (page: Page) => ({
  searchBox: page.getByRole('searchbox', { name: localization.search.label }),
  main: page.getByRole('main'),
  searchCards: page.getByRole('article'),
  searchTag: (term: string) => page.getByRole('button', { name: `"${term}"` }),
  typeCheckbox: (name: string) => page.getByRole('checkbox', { name }),
  subjectCheckbox: (name: string) => page.getByRole('checkbox', { name }),
});

test('Type filter starts open and search filter can be expanded', async ({ page }) => {
  await page.goto('/classifications');
  await stabilize();

  const typeFilter = page.getByRole('button', { name: localization.classification.type });
  await expect(typeFilter).toHaveAttribute('aria-expanded', 'true');

  const searchFilter = page.getByRole('button', { name: localization.search.label });
  await expect(searchFilter).toHaveAttribute('aria-expanded', 'false');
  await searchFilter.click();
  await expect(page.getByRole('searchbox', { name: localization.search.label })).toBeVisible();
});

test('Initial page shows all results', async ({ classificationsPage }) => {
  // Remove default set filter
  await classificationsPage.getByRole('button', { name: REMOVE_STANDARD }).click();
  const { main } = getLocators(classificationsPage);
  await expect(main).toContainText(TOTAL_RESULTS_TEXT);
});

test.describe('When searching with a term', () => {
  test.beforeEach(async ({ classificationsPage }) => {
    // Remove default set filter
    await classificationsPage.getByRole('button', { name: REMOVE_STANDARD }).click();
    await expandFilterGroups(classificationsPage);
    const { searchBox } = getLocators(classificationsPage);
    await searchBox.fill(searchTerm);
  });

  test('returns filtered results', async ({ classificationsPage }) => {
    const { main, searchCards } = getLocators(classificationsPage);
    await expect(main).toContainText(FILTERED_RESULTS_TEXT);

    const firstSearchResult = searchCards.first();
    await expect(firstSearchResult).toBeVisible();
    const matchingStandard = searchResults.find((result) => result.id === 107 && result.language === 'nb')!;
    await expect(firstSearchResult).toContainText(stripTitlePrefix(matchingStandard.name));
    await expect(
      firstSearchResult.getByRole('heading', { name: stripTitlePrefix(matchingStandard.name) }),
    ).toContainText(searchTerm, {
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
    const highestScoreResult: SearchResultResource = searchResults.find(
      (result) => result.id === 107 && result.language === 'nb',
    )!;

    await expect(
      searchCards.first().getByRole('heading', { name: stripTitlePrefix(highestScoreResult.name) }),
    ).toBeVisible();
  });

  test('only contains nb language results', async ({ classificationsPage }) => {
    const { searchCards } = getLocators(classificationsPage);
    const excludedNnText = 'Kodeliste for måleeiningar';
    const allCardsText = await searchCards.allInnerTexts();
    expect(allCardsText.join(' ')).not.toContain(excludedNnText);
  });

  test('Search result can be filtered by type', async ({ classificationsPage }) => {
    const { main, typeCheckbox } = getLocators(classificationsPage);
    await checkCheckbox(typeCheckbox(STANDARD));
    await expect(main).toContainText(ONE_RESULT_TEXT);

    await typeCheckbox(STANDARD).uncheck();
    await checkCheckbox(typeCheckbox(CODELIST));
    await expect(main).toContainText(TWO_RESULTS_TEXT);
  });

  test('Search result can be filtered by subject', async ({ classificationsPage }) => {
    const { main, subjectCheckbox } = getLocators(classificationsPage);

    await checkCheckbox(subjectCheckbox(companiesEnterprises));
    await expect(main).toContainText(ONE_RESULT_TEXT);
  });
  test('Search result can be sorted by different criteria after initial search', async ({ classificationsPage }) => {
    const { searchCards } = getLocators(classificationsPage);
    const sortSelect = classificationsPage.getByLabel(localization.search.sort.label);

    // Default sort is by search score - capture the first result
    const firstBySearchScore = await searchCards.first().innerText();

    // Sort by title descending - should differ from initial sort based on test data
    await sortSelect.selectOption('titleDesc');
    const firstByTitleDesc = await searchCards.first().innerText();
    expect(firstByTitleDesc).not.toBe(firstBySearchScore);
  });
});

test('search term variant returns same results', async ({ classificationsPage }) => {
  // Remove default set filter
  await classificationsPage.getByRole('button', { name: REMOVE_STANDARD }).click();
  await expandFilterGroups(classificationsPage);
  const { searchBox } = getLocators(classificationsPage);
  await searchBox.fill(searchTermVariant);
  const { main } = getLocators(classificationsPage);
  await expect(main).toContainText(FILTERED_RESULTS_TEXT);
});
