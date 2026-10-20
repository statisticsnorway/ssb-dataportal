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
 * Render checkbox-based filter for lifecycle status.
 *
 * @param variablesPromise - Promise resolving variable definitions.
 * @param selectedItems - The currently selected filter items.
 * @param onFilterChange - Callback triggered when a filter item is toggled.
 *
 * @returns A CheckboxFilter component.
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
