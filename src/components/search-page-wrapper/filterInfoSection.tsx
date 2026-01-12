import { Tag } from '@digdir/designsystemet-react';
import React, { ReactNode } from 'react';
import styles from './search-page/search-page.module.css';

interface FilterInfoSectionProps {
  filterTags?: ReactNode[];
}

export const FilterInfoSection: React.FC<FilterInfoSectionProps> = ({ filterTags }) => {
  if (!filterTags) return null;

  // Check if infoContent is an array
  if (Array.isArray(filterTags)) {
    return (
      <section className={styles.infoSection}>
        {filterTags.map((tag, key) => (
          <Tag key={key}>{tag}</Tag>
        ))}
      </section>
    );
  }
};
