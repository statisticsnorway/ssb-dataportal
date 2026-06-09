import { Select } from '@digdir/designsystemet-react';
import type { FilterItem } from '@/types/filters';
import { CollapsibleCard } from '../collapsible-card';
import styles from './select-filter.module.css';

interface SelectFilterProps {
  filterHeading: string;
  filters: FilterItem[];
  selectedValue: string;
  defaultOptionLabel: string;
  onFilterChange: (value: string) => void;
  defaultOptionValue?: string;
  id?: string;
}

/**
 * SelectFilter component renders a collapsible card containing a single-select dropdown.
 *
 * Each option represents one filter value. The default option represents no active filter.
 */
export const SelectFilter = ({
  filterHeading,
  filters,
  selectedValue,
  defaultOptionLabel,
  onFilterChange,
  defaultOptionValue = '',
  id,
}: SelectFilterProps) => {
  return (
    <CollapsibleCard heading={filterHeading} contentClassName={styles.selectFilterItems}>
      <Select
        id={id}
        data-size='sm'
        aria-label={filterHeading}
        value={selectedValue}
        onChange={(event) => onFilterChange(event.target.value)}
      >
        <option value={defaultOptionValue}>{defaultOptionLabel}</option>
        {filters.map((filter) => (
          <option key={filter.value} value={filter.value}>
            {filter.label}
            {filter.count == null ? '' : ` (${filter.count})`}
          </option>
        ))}
      </Select>
    </CollapsibleCard>
  );
};
