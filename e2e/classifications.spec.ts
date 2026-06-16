import { localization } from '@/libs/language';
import { checkCheckbox } from './utils/commonUtils';
import { expect, test } from './fixtures/classifications.fixture';

const arbeidOgLonn = /Arbeid og lønn/;
const bankOgFinans = /Bank og finansmarked/;

test('Classifications page renders hits and sort control', async ({ classificationsPage }) => {
  await expect(classificationsPage.getByTestId('search-card').first()).toBeVisible();
  await expect(classificationsPage.getByLabel(localization.search.sort.label)).toBeVisible();
});

test('Filter by subject field displays tag (listitem) with close button', async ({ classificationsPage }) => {
  const main = classificationsPage.getByRole('main');
  const checkbox = classificationsPage.getByRole('checkbox', { name: arbeidOgLonn });
  await checkCheckbox(checkbox);

  const filterTag = classificationsPage.getByRole('listitem').filter({ hasText: arbeidOgLonn });
  await expect(filterTag).toBeVisible();

  const removeButton = filterTag.getByRole('button');
  await expect(removeButton).toBeVisible();
  await removeButton.click();

  await expect(classificationsPage).not.toHaveURL(/[?&]subjects=/);
});

test('Select more than one filter displays a "remove all" tag', async ({ classificationsPage }) => {
  const filterOne = classificationsPage.getByRole('checkbox', { name: arbeidOgLonn });
  const filterTwo = classificationsPage.getByRole('checkbox', { name: bankOgFinans });

  await checkCheckbox(filterOne);
  await checkCheckbox(filterTwo);

  const removeAllButton = classificationsPage.getByRole('button', { name: localization.button.removeFilter });
  await expect(removeAllButton).toBeVisible();
  await removeAllButton.click();

  await expect(classificationsPage).not.toHaveURL(/[?&]subjects=/);
  await expect(filterOne).not.toBeChecked();
  await expect(filterTwo).not.toBeChecked();
});

test('Sort classifications', async ({ classificationsPage }) => {
  const sortSelect = classificationsPage.getByLabel(localization.search.sort.label);
  const firstCard = classificationsPage.getByTestId('search-card').first();

  await sortSelect.selectOption('titleAsc');
  const firstAsc = await firstCard.innerText();

  await sortSelect.selectOption('titleDesc');
  expect(await firstCard.innerText()).not.toBe(firstAsc);

  await sortSelect.selectOption('lastChanged');
  await expect(classificationsPage).toHaveURL(/[?&]sort=lastChanged/);
});

test('Can navigate to classification details from first result card', async ({ classificationsPage }) => {
  const firstCard = classificationsPage.getByTestId('search-card').first();
  await firstCard.getByRole('link').first().click();
  await expect(classificationsPage).toHaveURL(/\/classifications\/\d+$/);
});

test.describe('Classifications - pagination', () => {
  test('Displays 20 hits on first page and active page is 1', async ({ classificationsPage }) => {
    await expect(classificationsPage.getByTestId('search-card')).toHaveCount(20);
    await expect(classificationsPage.getByTestId('page-active')).toHaveText('1');
  });

  test('Next/previous navigation keeps 20 hits', async ({ classificationsPage }) => {
    await classificationsPage.getByRole('button', { name: localization.next }).click();
    await expect(classificationsPage.getByTestId('page-active')).toHaveText('2');
    await expect(classificationsPage.getByTestId('search-card')).toHaveCount(20);

    await classificationsPage.getByRole('button', { name: localization.previous }).click();
    await expect(classificationsPage.getByTestId('page-active')).toHaveText('1');
    await expect(classificationsPage.getByTestId('search-card')).toHaveCount(20);
  });

  test('Filter resets to page 1', async ({ classificationsPage }) => {
    await classificationsPage.getByRole('button', { name: localization.next }).click();
    await expect(classificationsPage.getByTestId('page-active')).toHaveText('2');

    await classificationsPage.getByRole('checkbox', { name: arbeidOgLonn }).check();
    await expect(classificationsPage.getByTestId('page-active')).toHaveText('1');
    await expect(classificationsPage).not.toHaveURL(/[?&]page=/);
  });

  test('Sorting resets to page 1', async ({ classificationsPage }) => {
    await classificationsPage.getByRole('button', { name: localization.next }).click();
    await expect(classificationsPage.getByTestId('page-active')).toHaveText('2');

    await classificationsPage.getByLabel(localization.search.sort.label).selectOption('titleDesc');
    await expect(classificationsPage.getByTestId('page-active')).toHaveText('1');
    await expect(classificationsPage).not.toHaveURL(/[?&]page=/);
  });
});

test.describe('Classifications URL state', () => {
  test('updates URL when selecting subject filter', async ({ classificationsPage }) => {
    await classificationsPage.getByRole('checkbox', { name: arbeidOgLonn }).check();
    await expect(classificationsPage).toHaveURL(/[?&]subjects=al/);
    await expect(classificationsPage).not.toHaveURL(/[?&]page=/);
  });

  test('updates URL when sorting', async ({ classificationsPage }) => {
    await classificationsPage.getByLabel(localization.search.sort.label).selectOption('titleDesc');
    await expect(classificationsPage).toHaveURL(/[?&]sort=titleDesc/);
    await expect(classificationsPage).not.toHaveURL(/[?&]page=/);
  });

  test('updates URL when changing page', async ({ classificationsPage }) => {
    await classificationsPage.getByRole('button', { name: localization.next }).click();
    await expect(classificationsPage).toHaveURL(/[?&]page=2/);
    await expect(classificationsPage.getByTestId('page-active')).toHaveText('2');
  });

  test('filtering from page 2 resets page parameter', async ({ classificationsPage }) => {
    await classificationsPage.getByRole('button', { name: localization.next }).click();
    await expect(classificationsPage).toHaveURL(/[?&]page=2/);
    await expect(classificationsPage.getByTestId('page-active')).toHaveText('2');

    await classificationsPage.getByRole('checkbox', { name: arbeidOgLonn }).check();
    await expect(classificationsPage).toHaveURL(/[?&]subjects=al/);
    await expect(classificationsPage).not.toHaveURL(/[?&]page=/);
    await expect(classificationsPage.getByTestId('page-active')).toHaveText('1');
  });

  test('sorting from page 2 resets page parameter', async ({ classificationsPage }) => {
    await classificationsPage.getByRole('button', { name: localization.next }).click();
    await expect(classificationsPage).toHaveURL(/[?&]page=2/);
    await expect(classificationsPage.getByTestId('page-active')).toHaveText('2');

    await classificationsPage.getByLabel(localization.search.sort.label).selectOption('titleDesc');
    await expect(classificationsPage).toHaveURL(/[?&]sort=titleDesc/);
    await expect(classificationsPage).not.toHaveURL(/[?&]page=/);
    await expect(classificationsPage.getByTestId('page-active')).toHaveText('1');
  });

  test('hydrates UI from shared URL', async ({ classificationsPage }) => {
    await classificationsPage.goto('/classifications?sort=titleDesc&subjects=al');
    await expect(classificationsPage.getByLabel(localization.search.sort.label)).toHaveValue('titleDesc');
    await expect(classificationsPage.getByRole('checkbox', { name: arbeidOgLonn })).toBeChecked();
    await expect(classificationsPage.getByRole('listitem').filter({ hasText: arbeidOgLonn })).toBeVisible();
  });

  test('keeps URL state after refresh', async ({ classificationsPage }) => {
    await classificationsPage.goto('/classifications?sort=titleDesc&subjects=al');
    await classificationsPage.reload();
    await expect(classificationsPage.getByLabel(localization.search.sort.label)).toHaveValue('titleDesc');
    await expect(classificationsPage.getByRole('checkbox', { name: arbeidOgLonn })).toBeChecked();
  });
});
