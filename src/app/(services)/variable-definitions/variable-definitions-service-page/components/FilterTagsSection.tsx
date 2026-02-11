'use client';

import { useMemo } from 'react';
import { FilterTags } from '@/components/filter-tags';
import { useFilteredVariables } from '@/hooks/useFilterdVariables';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { FilterItem } from '@/types/filters';
import { SortTypes } from '@/types/sort';

interface FilterTagsSectionProps {
  variablesPromise: Promise<{ data: RenderedView[]; error: Error | null }>;
  subjectFilters: FilterItem[];
  textFilter: string;
  sortOption: SortTypes;
  onClose: (filter: FilterItem) => void;
  onClearAll: () => void;
  onClearSearch: () => void;
}

export const FilterTagsSection = ({
  variablesPromise,
  subjectFilters,
  textFilter,
  sortOption,
  onClose,
  onClearAll,
  onClearSearch,
}: FilterTagsSectionProps) => {
  const { filteredVariables, error } = useFilteredVariables({
    variablesPromise,
    textFilter,
    subjectFilters,
    sortOption,
  });

  if (error) return null;

  /**
   * Returns a memoized array of the counts per selected filter.
   *
   * @param displayedVariables - The full list of variable definitions currently being displayed.
   * @param subjectFilters - Currently selected subject filters.
   * @return An array of counts per filter, memoized for performance.
   */
  const filterCounts = useMemo(
    () =>
      Object.fromEntries(
        subjectFilters.map((f) => [
          f.value,
          filteredVariables.filter((v) => v.subject_fields.some((sf) => sf.code === f.value)).length,
        ]),
      ),
    [subjectFilters, filteredVariables],
  );

  return (
    <FilterTags
      activeFilters={subjectFilters}
      searchTerm={textFilter}
      onClose={onClose}
      onClearAll={onClearAll}
      onClearSearch={onClearSearch}
      filterCounts={filterCounts}
    />
  );
};
