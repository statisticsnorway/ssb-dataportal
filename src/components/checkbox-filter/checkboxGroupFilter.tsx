import { Checkbox } from '@digdir/designsystemet-react';
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
  return (
    <Checkbox.Group
      onChange={onChange}
      size='small'
      value={value}
      legend={''}
      className={styles.checkboxGroup}
    >
      {items.map(({ value, label }) => (
        <Checkbox
          size='small'
          key={`checkbox-item-${value}`}
          value={`${value}`}
          aria-label={label}
        >
          {label}
        </Checkbox>
      ))}
    </Checkbox.Group>
  );
};
