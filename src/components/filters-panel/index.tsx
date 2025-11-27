import React from 'react';
import { FilterGroup } from '@/types/filters';
import { CheckboxFilter } from '../checkbox-filter';

const FiltersPanelComponent = ({ filterGroups }: { filterGroups: FilterGroup[] }) => {
  return (
    <>
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

const FiltersPanel = React.memo(FiltersPanelComponent);
FiltersPanel.displayName = 'FiltersPanel';

export { FiltersPanel };
