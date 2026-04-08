import { useMemo } from 'react';
import { AppErrorState } from '@/components/app-state';
import { SearchHitContainer } from '@/components/search-page-wrapper/search-hits-container';
import { useFilteredVariables } from '@/hooks/useFilteredVariables';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { localization } from '@/libs/language';
import { VardefSearchHit } from '../../components/vardefSearchHit';
import { mapErrorMessage } from './utils';
import { useVariableDefinitionsContext } from './variableDefinitionContext';

interface ResultsSectionProps {
  currentPage: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
}

/**
 * ResultsSection renders the search results.
 *
 * It uses the `useVariableDefinitionsContext` to access the filtered list
 * of variables and calculates the total number of hits and pages. It then
 * paginates the results and renders them using the `SearchHitContainer`
 * component, which in turn uses the `VardefSearchHit` component to render
 * each individual hit.
 *
 * @param currentPage - The current page number.
 * @param pageSize - The number of results per page.
 * @param handlePageChange - Callback triggered when the page changes.
 *
 * @returns A SearchHitContainer component populated with paginated search results.
 */
export const ResultsSection = ({ currentPage, pageSize, handlePageChange }: ResultsSectionProps) => {
  const { variablesPromise, textFilter, subjectFilters, statusFilters, sortOption } = useVariableDefinitionsContext();

  const { filteredVariables, error } = useFilteredVariables({
    variablesPromise,
    textFilter,
    subjectFilters,
    statusFilters,
    sortOption,
  });

  const forceError = process.env.NEXT_PUBLIC_ENABLE_RESULTS_ERROR_PREVIEW === 'true';
  const effectiveError = forceError ? new Error('Forced error preview') : error;

  const totalHits = filteredVariables.length;
  const totalPages = Math.ceil(totalHits / pageSize);

  const paginatedVariables = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVariables.slice(start, start + pageSize);
  }, [filteredVariables, currentPage, pageSize]);

  if (effectiveError) {
    return (
      <AppErrorState
        title={localization.error.technicalProblemsTitle}
        message={mapErrorMessage(effectiveError)}
        statusCode='500'
        homeHref='/'
        homeVariant={'primary'}
        helpList={[localization.error.helpChangeFilters, localization.error.helpHome]}
      />
    );
  }

  return (
    <SearchHitContainer
      searchHits={paginatedVariables}
      renderHit={(hit) => <VardefSearchHit key={(hit as RenderedView).id} variableDefinition={hit as RenderedView} />}
      noSearchHits={totalHits === 0}
      onPageChange={handlePageChange}
      paginationInfo={{ currentPage, totalPages }}
    />
  );
};
