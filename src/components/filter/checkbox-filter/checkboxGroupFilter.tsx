import {
  Button,
  Checkbox,
  Fieldset,
  FieldsetLegend,
  useCheckboxGroup,
  ValidationMessage,
} from '@digdir/designsystemet-react';
import { FilterItem } from '@/types/filters';
import styles from './checkbox.module.css';

interface CheckboxGroupProps {
  items: FilterItem[];
  onChange: (value: string[]) => void;
  value?: string[];
  filterHeading: string;
  isOpen: boolean;
  handleToggle: () => void;
}

export const CheckboxGroupFilter = ({
  filterHeading,
  items,
  onChange,
  value,
  isOpen,
  handleToggle,
}: CheckboxGroupProps) => {
  const { getCheckboxProps, validationMessageProps } = useCheckboxGroup({
    value: value,
    onChange,
  });

  return (
    <Fieldset>
      <Button
        className={styles.toggleFilter}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={`filter-${filterHeading}`}
      >
        <FieldsetLegend className={styles.filterHeader}>{filterHeading}</FieldsetLegend>
      </Button>
      {isOpen ? (
        <div>
          {items.map(({ value: itemValue, label }) => (
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
  );
};
