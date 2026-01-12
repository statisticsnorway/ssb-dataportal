import { Heading } from '@digdir/designsystemet-react';
import React from 'react';
import { FilterGroup } from '@/types/filters';
import { CheckboxFilter } from '../checkbox-filter';

const FiltersPanelComponent = ({ filterGroups }: { filterGroups: FilterGroup[] }) => {
  return (
    <>
      <Heading level={3} data-size='sm'>
        Filter
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

const FiltersPanel = React.memo(FiltersPanelComponent);
FiltersPanel.displayName = 'FiltersPanel';

export { FiltersPanel };
