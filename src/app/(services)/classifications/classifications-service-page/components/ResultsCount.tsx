import { use, useMemo } from 'react';
import { localization, SupportedLanguage } from '@/libs/language';
import {
  filterAndSortClassifications,
  mapSearchResultsToClassifications,
} from '@/utils/classifications/filterAndSortClassifications';
import { useClassificationContext } from './classificationContext';

interface ResultsCountProps {
  language: SupportedLanguage;
}

/**
 * Renders the total number of classification hits after applying the active
 * search query, subject and type filters, and sort option.
 *
 * @param props.language - Active UI language, used to match search hits to
 *   classifications in the correct language variant.
 */
export const ResultsCount = ({ language }: Readonly<ResultsCountProps>) => {
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
        const lang = rec.language;
        return typeof lang === 'string' ? lang : null;
      },
      language,
    });
  }, [classifications, searchResults, searchQuery, language]);

  const totalHits = useMemo(
    () =>
      filterAndSortClassifications(baseClassifications, selectedSubjectCodes, sortOption, selectedClassificationTypes)
        .length,
    [baseClassifications, selectedSubjectCodes, sortOption, selectedClassificationTypes],
  );

  if (totalHits === 0) return localization.search.noHits;
  return `${totalHits} ${localization.search.hits}`;
};
