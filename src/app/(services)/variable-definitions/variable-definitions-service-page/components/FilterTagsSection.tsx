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

export const FilterTagsSection = ({ onClose, onClearAll, onClearSearch }: FilterTagsSectionProps) => {
  const { filteredVariables, subjectFilters, statusFilters, textFilter, error } = useVariableDefinitionsContext();
  if (error) return null;

  /**
   * Returns a memoized array of the counts per selected filter.
   *
   * @param displayedVariables - The full list of variable definitions currently being displayed.
   * @param subjectFilters - Currently selected subject filters.
   * @return An array of counts per filter, memoized for performance.
   */
  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    // Count subject filters
    subjectFilters.forEach((f) => {
      counts[f.value] = filteredVariables.filter((v) => v.subject_fields?.some((sf) => sf.code === f.value)).length;
    });

    // Count status filters
    statusFilters.forEach((f) => {
      counts[f.value] = filteredVariables.filter((v) => v.variable_status === f.value).length;
    });

    return counts;
  }, [subjectFilters, statusFilters, filteredVariables]);

  const activeFilters = subjectFilters.concat(statusFilters);
  return (
    <FilterTags
      activeFilters={activeFilters}
      searchTerm={textFilter}
      onClose={onClose}
      onClearAll={onClearAll}
      onClearSearch={onClearSearch}
      filterCounts={filterCounts}
    />
  );
};
