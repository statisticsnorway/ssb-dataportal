import React from 'react';
import { FilterGroup } from '@/types/filters';
import { CheckboxFilter } from '../checkbox-filter';
import styles from './search-filter.module.css';

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
