import { use, useMemo } from 'react';
import { SearchHitContainer } from '@/components/search-page-wrapper/search-hits-container';
import { ClassificationResource } from '@/libs/data-access/klass';
import { localization, SupportedLanguage } from '@/libs/language';
import {
  filterAndSortClassifications,
  mapSearchResultsToClassifications,
} from '@/utils/classifications/filterAndSortClassifications';
import { ClassificationSearchHit } from '../classificationSearchHit';
import { useClassificationContext } from './classificationContext';

interface ResultsSectionProps {
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  language: SupportedLanguage;
}

/**
 * Renders the paginated list of classification search hits for the current
 * page, applying subject/type filters, sort order, and search-hit ordering.
 *
 * @param props.currentPage - 1-based current page index.
 * @param props.pageSize - Hits per page.
 * @param props.onPageChange - Called with the next page index on pagination.
 * @param props.language - Active UI language, used to match search hits to
 *   classifications in the correct language variant.
 */
export const ResultsSection = ({ currentPage, pageSize, onPageChange, language }: ResultsSectionProps) => {
  const {
    searchResultPromise,
    classificationsPromise,
    selectedSubjectCodes,
    subjectFieldsPromise,
    selectedClassificationTypes,
    sortOption,
    isSearchActive,
  } = useClassificationContext();

  const { data: classifications } = use(classificationsPromise);
  const { data: searchResults } = use(searchResultPromise);
  const { data: subjectFields } = use(subjectFieldsPromise);

  /**
   * Maps search results to classifications, preserving the order of search results
   */
  const mappedClassifications = useMemo(() => {
    if (!isSearchActive) return classifications ?? [];
    return mapSearchResultsToClassifications(classifications ?? [], searchResults ?? [], {
      classificationIdSelector: (item) => item.id,
      languageSelector: (item) => item.language,
      language,
    });
  }, [classifications, searchResults, isSearchActive, language]);

  const keepInputOrder = isSearchActive && sortOption === 'titleAsc';

  const sortedHits = useMemo(
    () =>
      filterAndSortClassifications(
        mappedClassifications,
        selectedSubjectCodes,
        sortOption,
        selectedClassificationTypes,
        keepInputOrder,
      ),
    [mappedClassifications, selectedSubjectCodes, sortOption, selectedClassificationTypes, keepInputOrder],
  );

  const totalHits = sortedHits.length;
  const totalPages = Math.max(1, Math.ceil(totalHits / pageSize));

  const paginatedHits = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedHits.slice(start, start + pageSize);
  }, [sortedHits, currentPage, pageSize]);

  return (
    <SearchHitContainer
      ariaLabel={localization.search.classifications}
      searchHits={paginatedHits}
      noSearchHits={totalHits === 0}
      onPageChange={onPageChange}
      paginationInfo={{ currentPage, totalPages }}
      renderHit={(hit) => (
        <ClassificationSearchHit
          key={String((hit as ClassificationResource).id)}
          classification={hit as ClassificationResource}
          subjectFields={subjectFields}
        />
      )}
    />
  );
};
