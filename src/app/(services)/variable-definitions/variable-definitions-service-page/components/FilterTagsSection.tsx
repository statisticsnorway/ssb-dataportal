'use client';

import { use, useMemo } from 'react';
import { FilterTags } from '@/components/filter-tags';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { FilterItem } from '@/types/filters';
import { filterAndSortVariables } from '@/utils/filterAndSort';

interface FilterTagsSectionProps {
  variablesPromise: Promise<{ data: RenderedView[]; error: any }>;
  activeFilters: FilterItem[];
  searchTerm: string;
  onClose: (filter: FilterItem) => void;
  onClearAll: () => void;
  onClearSearch: () => void;
}

export const FilterTagsSection = ({
  variablesPromise,
  activeFilters,
  searchTerm,
  onClose,
  onClearAll,
  onClearSearch,
}: FilterTagsSectionProps) => {
  const { data: variables, error } = use(variablesPromise);

  if (error) return null;

  const displayedVariables = useMemo(
    () => filterAndSortVariables(variables, searchTerm, activeFilters, 'titleAsc'),
    [variables, searchTerm, activeFilters],
  );

  const filterCounts = useMemo(
    () =>
      Object.fromEntries(
        activeFilters.map((f) => [
          f.value,
          displayedVariables.filter((v) => v.subject_fields.some((sf) => sf.code === f.value)).length,
        ]),
      ),
    [activeFilters, displayedVariables],
  );

  return (
    <FilterTags
      activeFilters={activeFilters}
      searchTerm={searchTerm}
      onClose={onClose}
      onClearAll={onClearAll}
      onClearSearch={onClearSearch}
      filterCounts={filterCounts}
    />
  );
};
