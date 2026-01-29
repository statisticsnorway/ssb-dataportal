'use client';

import { Button, Card, Checkbox, Fieldset, FieldsetLegend } from '@digdir/designsystemet-react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { FilterItem } from '@/types/filters';
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
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Card data-color={'accent'} className={`${styles.filterCard} ${!isOpen ? styles.hidden : ''}`}>
      <Fieldset>
        <Button
          className={styles.toggleFilter}
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-controls={`filter-${filterHeading}`}
        >
          <FieldsetLegend className={styles.filterHeader}>{filterHeading}</FieldsetLegend>
          {isOpen ? (
            <ChevronDownIcon title='Lukk filter' className={styles.chevronUpDown} />
          ) : (
            <ChevronUpIcon title='Åpne filter' className={styles.chevronUpDown} />
          )}
        </Button>
        {isOpen ? (
          <div id={`filter-items-${filterHeading}`} className={`${styles.filterItems} ${!isOpen ? styles.hidden : ''}`}>
            {filters.map((filter) => {
              return (
                <Checkbox
                  key={filter.code}
                  label={filter.name}
                  className={styles.checkbox}
                  checked={selectedItems.some((item) => item.code === filter.code)}
                  onChange={() => onFilterChange(filter)}
                />
              );
            })}
          </div>
        ) : null}
      </Fieldset>
    </Card>
  );
};
