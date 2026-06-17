import { describe, expect, it } from 'vitest';
import type { ClassificationResource, SearchResultResource } from '@/libs/data-access/klass';
import classificationsMock from '@/static-data/classifications.json';
import searchResultsMock from '@/static-data/klass-search-results.json';
import { ClassificationType } from '@/types/classification';
import { filterAndSortClassifications, mapSearchResultsToClassifications } from '@/utils/filterAndSortClassifications';

const classifications: ClassificationResource[] = classificationsMock.classifications.map((c) => ({
  ...c,
  lastModified: new Date(c.lastModified),
  classificationType: c.classificationType as ClassificationResource['classificationType'],
}));
const searchResults = searchResultsMock;

describe('mapSearchResultsToClassifications', () => {
  it('maps, sorts and deduplicates', () => {
    const result = mapSearchResultsToClassifications(classifications, searchResults, {
      classificationIdSelector: (item: SearchResultResource) => item.id,
      languageSelector: (item: SearchResultResource) => item.language,
      language: 'nb',
    });

    expect(result.length).toBeGreaterThan(0);
    expect(new Set(result.map((c) => c.id)).size).toBe(result.length);
  });
});

describe('filterAndSortClassifications', () => {
  it('filters by type', () => {
    const result = filterAndSortClassifications(classifications, [], 'titleAsc', [ClassificationType.Kodeliste], true);

    expect(result.every((c) => c.classificationType === ClassificationType.Kodeliste)).toBe(true);
  });
});
