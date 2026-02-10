'use client';

import { use, useMemo } from 'react';
import { SearchHitContainer } from '@/components/search-page-wrapper/search-hits-container';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { FilterItem } from '@/types/filters';
import { SortTypes } from '@/types/sort';
import { filterAndSortVariables } from '@/utils/filterAndSort';
import { VardefSearchHit } from '../../components/vardefSearchHit';
import { mapErrorMessage } from './utils';

interface ResultsSectionProps {
  variablesPromise: Promise<{ data: RenderedView[]; error: any }>;
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
  const { data: variables, error } = use(variablesPromise);

  if (error) {
    return <div>{mapErrorMessage(error)}</div>;
  }

  const displayedVariables = useMemo(
    () => filterAndSortVariables(variables, textFilter, subjectFilters, sortOption),
    [variables, textFilter, subjectFilters, sortOption],
  );

  const totalHits = displayedVariables.length;
  const totalPages = Math.ceil(totalHits / pageSize);
  const paginatedVariables = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return displayedVariables.slice(start, start + pageSize);
  }, [displayedVariables, currentPage, pageSize]);

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
