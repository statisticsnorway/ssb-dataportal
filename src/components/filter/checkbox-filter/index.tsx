'use client';

import { Card } from '@digdir/designsystemet-react';
import React, { useState } from 'react';
import { FilterItem } from '@/types/filters';
import styles from './checkbox.module.css';
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

  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Card data-color={'accent'} className={`${styles.filterCard} ${!isOpen ? styles.hidden : ''}`}>
      <CheckboxGroupFilter
        items={filters}
        value={(selectedItems ?? []).map(String)}
        onChange={handleChange}
        filterHeading={filterHeading}
        isOpen={isOpen}
        handleToggle={handleToggle}
      />
    </Card>
  );
};

export { CheckboxFilter };
