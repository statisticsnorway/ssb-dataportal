import React from 'react';
import styles from './search-filter.module.css';
import { FilterGroup } from '@/types/filters';
import { CheckboxFilter } from '../checkbox-filter';

const FiltersPanelComponent = ({ filterGroups }: { filterGroups: FilterGroup[] }) => {
  return (
    <div className={styles.filterSection}>
      {filterGroups.map(({ filterHeading, filters, selectedItems, onFilterChange }) => (
        <CheckboxFilter
          filterHeading={filterHeading}
          key={filterHeading}
          filters={filters}
          selectedItems={selectedItems}
          onFilterChange={onFilterChange}
        />
      ))}
    </div>
  );
};

const FiltersPanel = React.memo(FiltersPanelComponent);
FiltersPanel.displayName = 'FiltersPanel';

export { FiltersPanel };
