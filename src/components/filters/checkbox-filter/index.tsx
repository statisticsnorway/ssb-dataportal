'use client';

import { Checkbox } from '@digdir/designsystemet-react';
import { FilterItem } from '@/types/filters';
import { CollapsibleCard } from '../collapsible-card';
import styles from './checkbox.module.css';

interface CheckboxFilterProps {
  filterHeading: string;
  filters: FilterItem[];
  selectedItems: FilterItem[];
  onFilterChange: (filter: FilterItem) => void;
}

/**
 * CheckboxFilter component renders a collapsible card containing a group of checkboxes.
 *
 * Each checkbox represents a filter option, and users can select multiple items.
 *
 * @param filterHeading - Title for the filter group.
 * @param filters - Array of available filter options, each with `value`, `label` and optional `count`.
 * @param selectedItems - Array of currently selected filter items.
 * @param onFilterChange - Callback fired when selection changes. Receives the updated array of selected `FilterItem`s.
 *
 * @returns A Card collapsible card component with checkboxes for filtering.
 */
export const CheckboxFilter = ({ filterHeading, filters, selectedItems, onFilterChange }: CheckboxFilterProps) => {
  return (
    <CollapsibleCard heading={filterHeading}>
      {filters.map((filter) => (
        <Checkbox
          key={filter.value}
          label={`${filter.label}${filter.count != null ? ` (${filter.count})` : ''}`}
          className={styles.checkbox}
          checked={selectedItems.some((item) => item.value === filter.value)}
          onChange={() => onFilterChange(filter)}
        />
      ))}
    </CollapsibleCard>
  );
};
