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
  const { searchResultPromise, classificationsPromise, selectedSubjectCodes, selectedClassificationTypes, sortOption } =
    useClassificationContext();

  const { data: classifications } = use(classificationsPromise);
  const { data: searchResults } = use(searchResultPromise);

  const mappedClassifications = useMemo(
    () =>
      mapSearchResultsToClassifications(classifications ?? [], searchResults ?? [], {
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
      }),
    [classifications, searchResults],
  );

  const sortedHits = useMemo(
    () =>
      filterAndSortClassifications(
        mappedClassifications,
        selectedSubjectCodes,
        sortOption,
        selectedClassificationTypes,
      ),
    [mappedClassifications, selectedSubjectCodes, sortOption, selectedClassificationTypes],
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
          key={(hit as ClassificationResource).id ?? (hit as ClassificationResource).name}
          classification={hit as ClassificationResource}
        />
      )}
    />
  );
};
