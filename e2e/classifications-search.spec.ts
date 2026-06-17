// Næringsgrupp
// student
// sort search result by search score
// jordbær
// næringsgruppering
// tags label with title
// sortert etter search score
// sort after
// rangering

import { localization } from '@/libs/language';
import { expect, test } from './fixtures/classifications.fixture';

test('Search box is visible', async ({ classificationsPage }) => {
  const searchBox = classificationsPage.getByRole('searchbox', { name: `${localization.search.label}` });
  await expect(searchBox).toBeVisible();
});

// returns expected result
// sorts by search score
// filter tags
// filter codelists
