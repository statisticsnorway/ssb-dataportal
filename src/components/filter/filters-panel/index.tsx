import { Heading } from '@digdir/designsystemet-react';
import { CheckboxFilter } from '@/components/filter';
import { FilterGroup } from '@/types/filters';

const FILTER_HEADING = 'Filter';

/**
 * FiltersPanel component renders a list of filter groups with checkboxes.
 *
 * @param filterGroups - Array of filter groups to display. Each group contains:
 *   - filterHeading: string – The heading/title of the filter group.
 *   - filters: FilterItem[] – List of filter options.
 *   - selectedItems: FilterItem[] – Currently selected filter options.
 *   - onFilterChange: Callback triggered when selection changes.
 *
 * @returns A fragment containing a heading (if any filter groups exist) and a list of CheckboxFilter components.
 */
const FiltersPanel = ({ filterGroups }: { filterGroups: FilterGroup[] }) => {
  return (
    <>
      <Heading level={3} data-size='sm'>
        {filterGroups.length > 0 ? FILTER_HEADING : null}
      </Heading>
      {filterGroups.map(({ filterHeading, filters, selectedItems, onFilterChange }) => (
        <CheckboxFilter
          filterHeading={filterHeading}
          key={filterHeading}
          filters={filters}
          selectedItems={selectedItems}
          onFilterChange={onFilterChange}
        />
      ))}
    </>
  );
};

export { FiltersPanel };
