import { localization } from '@/libs/language';
import { checkCheckbox } from './utils/commonUtils';
import { expect, test } from './fixtures/classifications.fixture';

const arbeidOgLonn = 'Arbeid og lønn';
const bankOgFinans = 'Bank og finansmarked';

test('Classifications page renders hits and sort control', async ({ classificationsPage }) => {
  await expect(classificationsPage.getByTestId('search-card').first()).toBeVisible();
  await expect(classificationsPage.getByLabel(localization.search.sort.label)).toBeVisible();
});

test('Filter by subject field displays tag (listitem) with close button', async ({ classificationsPage }) => {
  const checkbox = classificationsPage.getByRole('checkbox', { name: arbeidOgLonn });
  await checkCheckbox(checkbox);

  const filterTag = classificationsPage.getByRole('listitem').filter({ hasText: arbeidOgLonn });
  await expect(filterTag).toBeVisible();

  const removeButton = filterTag.getByRole('button');
  await expect(removeButton).toBeVisible();
  await removeButton.click();

  await expect(classificationsPage).not.toHaveURL('subjects=');
});

test('Classification family "Region" is filterable', async ({ classificationsPage }) => {
  const checkbox = classificationsPage.getByRole('checkbox', { name: 'Region' });
  await checkCheckbox(checkbox);

  const filterTag = classificationsPage.getByRole('listitem').filter({ hasText: 'Region' });
  await expect(filterTag).toBeVisible();
});

test('Select more than one filter displays a "remove all" tag', async ({ classificationsPage }) => {
  const filterOne = classificationsPage.getByRole('checkbox', { name: arbeidOgLonn });
  const filterTwo = classificationsPage.getByRole('checkbox', { name: bankOgFinans });

  await checkCheckbox(filterOne);
  await checkCheckbox(filterTwo);

  const removeAllButton = classificationsPage.getByRole('button', { name: localization.button.removeFilter });
  await expect(removeAllButton).toBeVisible();
  await removeAllButton.click();

  await expect(classificationsPage).not.toHaveURL('subjects=');
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
  await expect(classificationsPage).toHaveURL('classifications?sort=lastChanged');
});

test.describe('Classifications - pagination', () => {
  test('Displays 8 hits on first page and active page is 1', async ({ classificationsPage }) => {
    await expect(classificationsPage.getByTestId('search-card')).toHaveCount(8);
    await expect(classificationsPage.getByTestId('page-active')).toHaveText('1');
  });
});

test.describe('Classifications URL state', () => {
  test('updates URL when selecting subject filter', async ({ classificationsPage }) => {
    await classificationsPage.getByRole('checkbox', { name: arbeidOgLonn }).check();
    await expect(classificationsPage).toHaveURL('classifications?subjects=al');
    await expect(classificationsPage).not.toHaveURL('page=');
  });

  test('updates URL when sorting', async ({ classificationsPage }) => {
    await classificationsPage.getByLabel(localization.search.sort.label).selectOption('titleDesc');
    await expect(classificationsPage).toHaveURL('classifications?sort=titleDesc');
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

test.describe('Classifications - type filter', () => {
  test('type filter checkboxes render with correct labels', async ({ classificationsPage }) => {
    await expect(classificationsPage.getByRole('checkbox', { name: 'Klassifikasjon' })).toBeVisible();
    await expect(classificationsPage.getByRole('checkbox', { name: 'Kodeliste' })).toBeVisible();
  });

  test('selecting Klassifikasjon filters results and updates URL', async ({ classificationsPage }) => {
    await classificationsPage.getByRole('checkbox', { name: 'Klassifikasjon' }).check();

    await expect(classificationsPage).toHaveURL('classifications?types=Klassifikasjon');
    await expect(classificationsPage.getByTestId('search-card')).toHaveCount(8);

    const filterTag = classificationsPage.getByRole('listitem').filter({ hasText: 'Klassifikasjon' });
    await expect(filterTag).toBeVisible();
    await filterTag.getByRole('button').click();
    await expect(classificationsPage).not.toHaveURL('types=');
  });

  test('selecting Kodeliste shows only code list results', async ({ classificationsPage }) => {
    await classificationsPage.getByRole('checkbox', { name: 'Kodeliste' }).check();

    await expect(classificationsPage).toHaveURL('classifications?types=Kodeliste');
    await expect(classificationsPage.getByTestId('search-card')).toHaveCount(2);
  });

  test('hydrates type filter from shared URL', async ({ classificationsPage }) => {
    await classificationsPage.goto('/classifications?types=Kodeliste');
    await expect(classificationsPage.getByRole('checkbox', { name: 'Kodeliste' })).toBeChecked();
    await expect(classificationsPage.getByTestId('search-card')).toHaveCount(2);
  });

  test('combined subject and type filter shows "remove all" button', async ({ classificationsPage }) => {
    await checkCheckbox(classificationsPage.getByRole('checkbox', { name: 'Klassifikasjon' }));
    await checkCheckbox(classificationsPage.getByRole('checkbox', { name: arbeidOgLonn }));

    const removeAllButton = classificationsPage.getByRole('button', { name: localization.button.removeFilter });
    await expect(removeAllButton).toBeVisible();
    await removeAllButton.click();

    await expect(classificationsPage).not.toHaveURL('types=');
    await expect(classificationsPage).not.toHaveURL('subjects=');
    await expect(classificationsPage.getByRole('checkbox', { name: 'Klassifikasjon' })).not.toBeChecked();
    await expect(classificationsPage.getByRole('checkbox', { name: arbeidOgLonn })).not.toBeChecked();
  });
});
