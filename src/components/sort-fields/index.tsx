import { SortTypes } from '@/types/tabs';
import { filter } from '@/utils/constants';
import { Select } from '@digdir/designsystemet-react';
import React from 'react';
import styles from './sort.module.css';

interface SortFieldsProps {
  sortOptions: SortTypes[];
  sortValue: SortTypes;
  onSortChange: (key: string) => void;
}

const sortLabels: Record<string, string> = {
  titleAsc: filter.sortNameAsc,
  titleDesc: filter.sortNameDesc,
  lastChanged: filter.sortLastUpdated,
};

const SortFields = ({ sortOptions, sortValue, onSortChange }: SortFieldsProps) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value as SortTypes);
  };
  return (
    <section className={styles.sortData}>
      <Select id='sortVariables' data-size='sm' aria-label='Select sort' onChange={handleSortChange} value={sortValue}>
        {sortOptions.map((key) => (
          <Select.Option key={key} value={key}>
            {sortLabels[key] || key}
          </Select.Option>
        ))}
      </Select>
    </section>
  );
};
export { SortFields };
