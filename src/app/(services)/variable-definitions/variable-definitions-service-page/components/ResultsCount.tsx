'use client';

import { use, useMemo } from 'react';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { localization } from '@/libs/language/src/localization';
import { FilterItem } from '@/types/filters';
import { SortTypes } from '@/types/sort';
import { filterAndSortVariables } from '@/utils/filterAndSort';

interface ResultsCountProps {
  variablesPromise: Promise<{ data: RenderedView[]; error: Error | null }>;
  textFilter: string;
  subjectFilters: FilterItem[];
  sortOption: SortTypes;
}

export const ResultsCount = ({ variablesPromise, textFilter, subjectFilters, sortOption }: ResultsCountProps) => {
  const { data: variables, error } = use(variablesPromise);
  if (error) return null;

  const displayedVariables = useMemo(
    () => filterAndSortVariables(variables, textFilter, subjectFilters, sortOption),
    [variables, textFilter, subjectFilters, sortOption],
  );

  const totalHits = displayedVariables.length;
  if (totalHits === 0) return localization.search.noHits;
  return `${totalHits} ${localization.search.hits}`;
};
