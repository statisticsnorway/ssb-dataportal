import { Select } from '@statisticsnorway/design-react';
import React from 'react';
import { localization } from '@/libs/language';
import { SortTypes } from '@/types/sort';
import styles from './sort-fields.module.css';

interface SortFieldsProps {
  sortOptions: ReadonlyArray<SortTypes>;
  sortValue: SortTypes;
  onSortChange: (key: SortTypes) => void;
}

const sortLabels: Record<string, string> = {
  titleAsc: localization.search.sort.titleAlphabeticalAsc,
  titleDesc: localization.search.sort.titleAlphabeticalDesc,
  lastChanged: localization.search.sort.lastUpdatedFirst,
};

const SortFields = ({ sortOptions, sortValue, onSortChange }: SortFieldsProps) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value as SortTypes);
  };
  return (
    <section className={styles.wrapper}>
      <Select
        id='sortVariables'
        data-size='sm'
        aria-label={localization.search.sort.label}
        onChange={handleSortChange}
        value={sortValue}
      >
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
