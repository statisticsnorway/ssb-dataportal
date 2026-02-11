'use client';

import { Alert } from '@digdir/designsystemet-react';
import { useMemo } from 'react';
import { SearchHitContainer } from '@/components/search-page-wrapper/search-hits-container';
import { useFilteredVariables } from '@/hooks/useFilterdVariables';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { FilterItem } from '@/types/filters';
import { SortTypes } from '@/types/sort';
import { VardefSearchHit } from '../../components/vardefSearchHit';
import { mapErrorMessage } from './utils';

interface ResultsSectionProps {
  variablesPromise: Promise<{ data: RenderedView[]; error: Error | null }>;
  textFilter: string;
  subjectFilters: FilterItem[];
  sortOption: SortTypes;
  currentPage: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
}

export const ResultsSection = ({
  variablesPromise,
  textFilter,
  subjectFilters,
  sortOption,
  currentPage,
  pageSize,
  handlePageChange,
}: ResultsSectionProps) => {
  const { filteredVariables, error } = useFilteredVariables({
    variablesPromise,
    textFilter,
    subjectFilters,
    sortOption,
  });

  if (error) {
    return (
      <div>
        <Alert data-color='danger'>{mapErrorMessage(error)}</Alert>
      </div>
    );
  }

  const totalHits = filteredVariables.length;
  const totalPages = Math.ceil(totalHits / pageSize);
  const paginatedVariables = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVariables.slice(start, start + pageSize);
  }, [filteredVariables, currentPage, pageSize]);

  return (
    <SearchHitContainer
      searchHits={paginatedVariables}
      renderHit={(hit) => <VardefSearchHit key={hit.id} variableDefinition={hit as RenderedView} />}
      noSearchHits={totalHits === 0}
      onPageChange={handlePageChange}
      paginationInfo={{ currentPage, totalPages }}
    />
  );
};
