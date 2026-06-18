import { localization } from '@/libs/language';
import { expect, test } from './fixtures/classifications.fixture';
import searchResultsMock from '@/static-data/klass-search-results.json';

const searchTerm = 'Næring';
const searchTermVariantOne = 'Næringsgrupp';
const searchTermVariantTwo = 'Næringsgruppering';
const searchResults = searchResultsMock;

test('Search box is visible', async ({ classificationsPage }) => {
  const searchBox = classificationsPage.getByRole('searchbox', { name: `${localization.search.label}` });
  await expect(searchBox).toBeVisible();
});

// Næringsgrupp
// student
// jordbær
// næringsgruppering

test('Search term returns results', async ({ classificationsPage }) => {
  const main = classificationsPage.getByRole('main');
  const searchBox = classificationsPage.getByRole('searchbox', { name: `${localization.search.label}` });
  await searchBox.fill(searchTerm);
  await expect(main).toContainText('3 treff');
  const firstSearchResult = classificationsPage.getByTestId('search-card').first();
  await expect(firstSearchResult).toBeVisible();
  await expect(firstSearchResult).toContainText(searchResults[0]!.name);
  // substring
  //await expect(firstSearchResult.getByRole('heading', { name: searchResults[0]!.name })).toContainText(searchTerm);
});

test('Search displays tag', async ({ classificationsPage }) => {
  const searchBox = classificationsPage.getByRole('searchbox', { name: `${localization.search.label}` });
  await searchBox.fill(searchTerm);
  const resultTag = classificationsPage.getByRole('button', { name: `"${searchTerm}"` });
  await expect(resultTag).toBeVisible();
});

test('Remove search by tag', async ({ classificationsPage }) => {
  const main = classificationsPage.getByRole('main');
  const searchBox = classificationsPage.getByRole('searchbox', { name: `${localization.search.label}` });
  await searchBox.fill(searchTerm);
  await expect(main).toContainText('3 treff');
  const resultTag = classificationsPage.getByRole('button', { name: `"${searchTerm}"` });
  await resultTag.click();
  await expect(main).not.toContainText('3 treff');
  await expect(resultTag).not.toBeInViewport();
});

test('Search result is sorted by search score', async ({ classificationsPage }) => {});

test('Search result can be sorted by different criteria', async ({ classificationsPage }) => {});

test('Search result can be filtered by type', async ({ classificationsPage }) => {});

test('Search result can be filtered by subject', async ({ classificationsPage }) => {});

// language ?
// maps ?
