import { use, useMemo } from 'react';
import { useAuthContext } from '@/app/authContext';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { VariableStatus } from '@/libs/data-access/variable-definitions/internal/models/VariableStatus';
import { FilterItem } from '@/types/filters';
import { SortTypes } from '@/types/sort';
import { filterAndSortVariables } from '@/utils/filterAndSort';

interface UseFilteredVariablesProps {
  variablesPromise: Promise<{ data: RenderedView[]; error: Error | null }>;
  textFilter: string;
  subjectFilters: FilterItem[];
  statusFilters: FilterItem[];
  sortOption: SortTypes;
}

export function useFilteredVariables({
  variablesPromise,
  textFilter,
  subjectFilters,
  statusFilters,
  sortOption,
}: UseFilteredVariablesProps) {
  const { data: variables, error } = use(variablesPromise);
  const { isAuthenticated } = useAuthContext();

  const visibleVariables = useMemo(
    () =>
      isAuthenticated ? variables : variables?.filter((v) => v.variable_status === VariableStatus.PublishedExternal),
    [variables, isAuthenticated],
  );

  const filteredVariables = useMemo(
    () => filterAndSortVariables(visibleVariables, textFilter, subjectFilters, statusFilters, sortOption),
    [visibleVariables, textFilter, subjectFilters, statusFilters, sortOption],
  );

  return { filteredVariables, error, variables };
}
