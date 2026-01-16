'use client';

import {
  Button,
  Card,
  Checkbox,
  Fieldset,
  FieldsetLegend,
  useCheckboxGroup,
  ValidationMessage,
} from '@digdir/designsystemet-react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { useEffect, useMemo, useState } from 'react';
import { FilterItem } from '@/types/filters';
import styles from './checkbox.module.css';

interface CheckboxFilterProps {
  filters: FilterItem[];
  filterHeading: string;
  selectedItems: FilterItem[];
  onFilterChange: (selected: FilterItem[]) => void;
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
export const CheckboxFilter = ({ filterHeading, filters, onFilterChange, selectedItems }: CheckboxFilterProps) => {
  const selectedValues = useMemo(() => selectedItems.map((s) => s.value), [selectedItems]);

  const { getCheckboxProps, validationMessageProps, setValue } = useCheckboxGroup({
    value: selectedValues,
    onChange: (values: string[]) => {
      // map string values to FilterItem[]
      const selectedObjects = filters.filter((f) => values.includes(f.value));
      onFilterChange(selectedObjects);
    },
  });

  // Sync checkboxes
  useEffect(() => {
    setValue(selectedValues);
  }, [selectedValues, setValue]);

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
          <div id={`filter-${filterHeading}`}>
            {filters.map(({ value, label }) => (
              <Checkbox className={styles.checkbox} label={label} key={value} {...getCheckboxProps({ value: value })} />
            ))}
            <ValidationMessage {...validationMessageProps} />
          </div>
        ) : null}
      </Fieldset>
    </Card>
  );
};
