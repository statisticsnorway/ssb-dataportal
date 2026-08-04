import { describe, expect, it } from 'vitest';
import type { ClassificationResource, SearchResultResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import classificationsMock from '@/static-data/classifications.json';
import searchResultsMock from '@/static-data/klass-search-results.json';
import { ClassificationType } from '@/types/classification';
import {
  filterAndSortClassifications,
  mapSearchResultsToClassifications,
} from '@/utils/classifications/filterAndSortClassifications';
import { parseClassification } from '../mock-data';

const classifications: ClassificationResource[] = classificationsMock.classifications.map((c) =>
  parseClassification(c),
);
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
    const result = filterAndSortClassifications(classifications, [], 'titleAsc', [ClassificationType.Codelist], true);

    expect(result.every((c) => c.classificationType === ClassificationType.Codelist)).toBe(true);
  });

  it('filters by type when api uses english classificationType values', () => {
    localization.setLanguage('en');
    const englishTypeClassifications: ClassificationResource[] = [
      {
        id: 1,
        name: 'Classification item',
        classificationType: 'Classification',
        lastModified: new Date(),
      },
      {
        id: 2,
        name: 'Code list item',
        classificationType: 'Codelist',
        lastModified: new Date(),
      },
    ];

    const standards = filterAndSortClassifications(
      englishTypeClassifications,
      [],
      'titleAsc',
      [ClassificationType.Classification],
      true,
    );
    const codelists = filterAndSortClassifications(
      englishTypeClassifications,
      [],
      'titleAsc',
      [ClassificationType.Codelist],
      true,
    );

    expect(standards.map((c) => c.id)).toEqual([1]);
    expect(codelists.map((c) => c.id)).toEqual([2]);
  });
});
