import { use, useMemo } from 'react';
import { SearchHitContainer } from '@/components/search-page-wrapper/search-hits-container';
import { ClassificationResource } from '@/libs/data-access/klass';
import { filterAndSortClassifications } from '@/utils/filterAndSortClassifications';
import { ClassificationSearchHit } from '../classificationSearchHit';
import { useClassificationContext } from './classificationContext';

interface ResultsSectionProps {
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const ResultsSection = ({ currentPage, pageSize, onPageChange }: ResultsSectionProps) => {
  const { classificationsPromise, selectedSubjectCodes, sortOption } = useClassificationContext();

  const { data: classifications } = use(classificationsPromise);

  const sortedHits = useMemo(
    () => filterAndSortClassifications(classifications, selectedSubjectCodes, sortOption),
    [classifications, selectedSubjectCodes, sortOption],
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
