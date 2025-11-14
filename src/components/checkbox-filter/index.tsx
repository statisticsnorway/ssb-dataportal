//import styles from './checkbox-tree.module.css';
import React from 'react';
import { CheckboxGroupFilter } from './checkboxGroupFilter';
import { FilterItem } from '@/types/filters';
import { Card } from '@digdir/designsystemet-react';

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
