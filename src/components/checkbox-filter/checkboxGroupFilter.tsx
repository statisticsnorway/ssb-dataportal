import { Checkbox, Fieldset, FieldsetLegend, useCheckboxGroup, ValidationMessage } from '@digdir/designsystemet-react';
import { FilterItem } from '@/types/filters';
import styles from './checkbox.module.css';

interface CheckboxGroupProps {
  items: FilterItem[];
  onChange: (value: string[]) => void;
  value?: string[];
  filterHeading: string;
}

export const CheckboxGroupFilter = ({ filterHeading, items, onChange, value }: CheckboxGroupProps) => {
  const { getCheckboxProps, validationMessageProps } = useCheckboxGroup({
    value: value,
    onChange,
  });
  return (
    <Fieldset
      data-size='small'
      //className={styles.checkboxGroup}
    >
      <FieldsetLegend className={styles.filterHeader}>{filterHeading}</FieldsetLegend>
      {items.map(({ value: itemValue, label }) => (
        <Checkbox label={label} key={itemValue} {...getCheckboxProps({ value: itemValue })} />
      ))}
      <ValidationMessage {...validationMessageProps} />
    </Fieldset>
  );
};
