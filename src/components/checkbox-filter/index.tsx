//import styles from './checkbox-tree.module.css';

import { Card } from '@digdir/designsystemet-react';
import React from 'react';
import { FilterItem } from '@/types/filters';
import { CheckboxGroupFilter } from './checkboxGroupFilter';

interface CheckboxFilterProps {
  filters: FilterItem[];
  filterHeading: string;
  selectedItems: string[];
  onFilterChange: (selected: string[]) => void;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({ filters, filterHeading, selectedItems, onFilterChange }) => {
  const handleChange = (newSelected: string[]) => {
    onFilterChange?.(newSelected);
  };

  return (
    <Card>
      <CheckboxGroupFilter
        items={filters}
        value={(selectedItems ?? []).map(String)}
        onChange={handleChange}
        filterHeading={filterHeading}
      />
    </Card>
  );
};

export { CheckboxFilter };
