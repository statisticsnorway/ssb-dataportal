import { use, useMemo } from 'react';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
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

  const filteredVariables = useMemo(
    () => filterAndSortVariables(variables, textFilter, subjectFilters, statusFilters, sortOption),
    [variables, textFilter, subjectFilters, sortOption],
  );

  return { filteredVariables, error, variables };
}
