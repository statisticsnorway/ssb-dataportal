'use client';

import { CheckboxFilter } from '@/components/filters/checkbox-filter';
import { useStatusCounts } from '@/hooks/useVariableCounts';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { localization } from '@/libs/language/src/localization';
import { FilterItem } from '@/types/filters';

interface StatusFiltersSectionProps {
  variablesPromise: Promise<{ data: RenderedView[]; error: Error | null }>;
  selectedItems: FilterItem[];
  onFilterChange: (filter: FilterItem) => void;
}

/**
 * FiltersSection renders a checkbox-based filter for subject areas.
 *
 * It resolves the provided `subjectFieldsPromise`, transforms the returned
 * subject fields into filter items, sorts them alphabetically by label,
 * and passes them to the `CheckboxFilter` component.
 *
 * @param subjectFieldsPromise - Promise resolving to subject field data.
 * @param selectedItems - The currently selected filter items.
 * @param onFilterChange - Callback triggered when a filter item is toggled.
 *
 * @returns A CheckboxFilter component populated with sorted subject filters.
 */
export const StatusFiltersSection = ({
  variablesPromise,
  selectedItems,
  onFilterChange,
}: StatusFiltersSectionProps) => {
  return (
    <CheckboxFilter
      filterHeading={localization.status.label}
      filters={useStatusCounts(variablesPromise)}
      selectedItems={selectedItems}
      onFilterChange={onFilterChange}
    />
  );
};
