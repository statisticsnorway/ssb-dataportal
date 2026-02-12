'use client';
import { Alert } from '@digdir/designsystemet-react';
import { useMemo } from 'react';
import { SearchHitContainer } from '@/components/search-page-wrapper/search-hits-container';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { VardefSearchHit } from '../../components/vardefSearchHit';
import { mapErrorMessage } from './utils';
import { useVariableDefinitionsContext } from './variableDefinitionContext';

interface ResultsSectionProps {
  currentPage: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
}

export const ResultsSection = ({ currentPage, pageSize, handlePageChange }: ResultsSectionProps) => {
  const { filteredVariables, error } = useVariableDefinitionsContext();

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
