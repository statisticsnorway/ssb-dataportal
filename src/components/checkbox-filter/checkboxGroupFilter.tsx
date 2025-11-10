import { Checkbox, Fieldset, useCheckboxGroup, ValidationMessage } from '@digdir/designsystemet-react';
import styles from './checkbox-tree.module.css';

type CheckboxGroupFilterItem = {
  value: string;
  label: string;
};

interface Props {
  items: CheckboxGroupFilterItem[];
  onChange: (value: string[]) => void;
  value?: string[];
}

export const CheckboxGroupFilter = ({ items, onChange, value }: Props) => {
  const { getCheckboxProps, validationMessageProps } = useCheckboxGroup({
    value: value,
    onChange,
  });
  return (
    <Fieldset
      data-size='small'
      className={styles.checkboxGroup}
    >
      {items.map(({ value: itemValue, label }) => (
        <Checkbox label={label} key={itemValue} {...getCheckboxProps({ value: itemValue})} />
      ))}
      <ValidationMessage {...validationMessageProps} />
    </Fieldset>
  );
};
