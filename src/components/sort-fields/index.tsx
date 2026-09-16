import { Select } from '@digdir/designsystemet-react';
import React from 'react';
import { localization } from '@/libs/language';
import styles from './sort-fields.module.css';

interface SortFieldsProps {
  sortOptions: ReadonlyArray<string>;
  sortValue: string;
  onSortChange: (key: string) => void;
  sortLabels?: Record<string, string>;
}

const SortFields = ({ sortOptions, sortValue, onSortChange, sortLabels }: SortFieldsProps) => {
  const defaultSortLabels: Record<string, string> = {
    titleAsc: localization.search.sort.titleAlphabeticalAsc,
    titleDesc: localization.search.sort.titleAlphabeticalDesc,
    lastChanged: localization.search.sort.lastUpdatedFirst,
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value);
  };

  const labels = { ...defaultSortLabels, ...sortLabels };

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
            {labels[key] || key}
          </Select.Option>
        ))}
      </Select>
    </section>
  );
};

export { SortFields };
