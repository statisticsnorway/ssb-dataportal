'use client';

import { useFilteredVariables } from '@/hooks/useFilterdVariables';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { localization } from '@/libs/language/src/localization';
import { FilterItem } from '@/types/filters';
import { SortTypes } from '@/types/sort';

interface ResultsCountProps {
  variablesPromise: Promise<{ data: RenderedView[]; error: Error | null }>;
  textFilter: string;
  subjectFilters: FilterItem[];
  sortOption: SortTypes;
}

export const ResultsCount = ({ variablesPromise, textFilter, subjectFilters, sortOption }: ResultsCountProps) => {
  const { filteredVariables, error } = useFilteredVariables({
    variablesPromise,
    textFilter,
    subjectFilters,
    sortOption,
  });

  if (error) return null;

  const totalHits = filteredVariables.length;
  if (totalHits === 0) return localization.search.noHits;
  return `${totalHits} ${localization.search.hits}`;
};
