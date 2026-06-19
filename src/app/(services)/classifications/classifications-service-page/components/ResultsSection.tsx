import { use, useMemo } from 'react';
import { SearchHitContainer } from '@/components/search-page-wrapper/search-hits-container';
import { ClassificationResource } from '@/libs/data-access/klass';
import { filterAndSortClassifications, mapSearchResultsToClassifications } from '@/utils/filterAndSortClassifications';
import { ClassificationSearchHit } from '../classificationSearchHit';
import { useClassificationContext } from './classificationContext';

interface ResultsSectionProps {
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const ResultsSection = ({ currentPage, pageSize, onPageChange }: ResultsSectionProps) => {
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
      language: 'nb',
    });
  }, [classifications, searchResults, isSearchActive]);

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
