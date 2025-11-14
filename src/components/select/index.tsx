'use client';

import { Select, SelectProps } from '@digdir/designsystemet-react';
import styles from './select.module.css';

export type SelectOption = {
  label: string;
  value: string;
};

export const MetadataSelect = (props: SelectProps) => {
  return (
    <div className={styles.select}>
      <Select {...props} />
    </div>
  );
};
