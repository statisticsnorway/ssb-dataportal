import { use, useMemo } from 'react';
import { localization } from '@/libs/language';
import { filterAndSortClassifications, mapSearchResultsToClassifications } from '@/utils/filterAndSortClassifications';
import { useClassificationContext } from './classificationContext';

export const ResultsCount = () => {
  const {
    classificationsPromise,
    searchResultPromise,
    selectedSubjectCodes,
    selectedClassificationTypes,
    sortOption,
    searchQuery,
  } = useClassificationContext();

  const { data: classifications } = use(classificationsPromise);
  const { data: searchResults } = use(searchResultPromise);

  const baseClassifications = useMemo(() => {
    if (!searchQuery) return classifications ?? [];

    return mapSearchResultsToClassifications(classifications ?? [], searchResults ?? [], {
      classificationIdSelector: (item) => {
        const rec = item as unknown as Record<string, unknown>;
        const id = rec.classificationId ?? rec.id;
        return typeof id === 'string' || typeof id === 'number' ? id : null;
      },
      languageSelector: (item) => {
        const rec = item as unknown as Record<string, unknown>;
        const language = rec.language;
        return typeof language === 'string' ? language : null;
      },
      language: 'nb',
    });
  }, [classifications, searchResults, searchQuery]);

  const totalHits = useMemo(
    () =>
      filterAndSortClassifications(baseClassifications, selectedSubjectCodes, sortOption, selectedClassificationTypes)
        .length,
    [baseClassifications, selectedSubjectCodes, sortOption, selectedClassificationTypes],
  );

  if (totalHits === 0) return localization.search.noHits;
  return `${totalHits} ${localization.search.hits}`;
};
