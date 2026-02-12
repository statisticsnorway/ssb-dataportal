'use client';
import { useMemo } from 'react';
import { FilterTags } from '@/components/filter-tags';
import { FilterItem } from '@/types/filters';
import { useVariableDefinitionsContext } from './variableDefinitionContext';

interface FilterTagsSectionProps {
  onClose: (filter: FilterItem) => void;
  onClearAll: () => void;
  onClearSearch: () => void;
}

/**
 * FilterTagsSection renders the active filter tags and search term.
 *
 * It uses the `useVariableDefinitionsContext` to access the currently
 * selected filters and search term. It calculates the count of variables
 * for each active filter and passes this information to the `FilterTags`
 * component, which renders the tags and provides controls for removing
 * individual filters or clearing all filters and the search term.
 *
 * @param onClose - Callback triggered when a filter tag is closed (removed).
 * @param onClearAll - Callback triggered when all filters and search term should be cleared.
 * @param onClearSearch - Callback triggered when the search term should be cleared.
 *
 * @returns A FilterTags component populated with active filters and search term.
 */
export const FilterTagsSection = ({ onClose, onClearAll, onClearSearch }: FilterTagsSectionProps) => {
  const { filteredVariables, subjectFilters, textFilter, error } = useVariableDefinitionsContext();
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
