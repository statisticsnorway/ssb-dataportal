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
  selectedItems: string[];
  onFilterChange: (selected: string[]) => void;
}

export const CheckboxFilter = ({ filterHeading, filters, onFilterChange, selectedItems }: CheckboxFilterProps) => {
  const { getCheckboxProps, validationMessageProps, setValue } = useCheckboxGroup({
    onChange: onFilterChange,
  });

  /*
  useEffect(() => {
    setValue((selectedItems ?? []).map(String));
  }, [selectedItems, setValue]);
*/
  const stringValues = useMemo(() => (selectedItems ?? []).map(String), [selectedItems]);

  useEffect(() => {
    setValue(stringValues);
  }, [stringValues, setValue]);

  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  console.log(`Selected filteres ${selectedItems}`);

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
          <div>
            {filters.map(({ value: itemValue, label }) => (
              <Checkbox
                className={styles.checkbox}
                label={label}
                key={itemValue}
                {...getCheckboxProps({ value: itemValue })}
              />
            ))}
            <ValidationMessage {...validationMessageProps} />
          </div>
        ) : null}
      </Fieldset>
    </Card>
  );
};
