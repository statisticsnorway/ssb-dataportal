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
 * The component manages syncing selected items with external state and provides validation messaging.
 *
 * @param filterHeading - Title for the filter group.
 * @param filters - Array of available filter options, each with `value` and `label`.
 * @param selectedItems - Array of currently selected filter items.
 * @param onFilterChange - Callback fired when selection changes. Receives the updated array of selected `FilterItem`s.
 *
 * @returns A Card component containing a collapsible filter group with checkboxes.
 */
export const CheckboxFilter = ({ filterHeading, filters, selectedItems, onFilterChange }: CheckboxFilterProps) => {
  return (
    <CollapsibleCard heading={filterHeading}>
      {filters.map((filter) => (
        <Checkbox
          key={filter.code}
          label={filter.name}
          className={styles.checkbox}
          checked={selectedItems.some((item) => item.code === filter.code)}
          onChange={() => onFilterChange(filter)}
        />
      ))}
    </CollapsibleCard>
  );
};
