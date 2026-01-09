import { Tag } from '@digdir/designsystemet-react';
import React, { ReactNode } from 'react';
import styles from './search-page/search-page.module.css';

interface InfoSectionProps {
  infoContent?: ReactNode | (string | number | ReactNode)[];
}

export const InfoSection: React.FC<InfoSectionProps> = ({ infoContent }) => {
  if (!infoContent) return null;

  // Check if infoContent is an array
  if (Array.isArray(infoContent)) {
    return (
      <section className={styles.infoSection}>
        {infoContent.map((tag, key) => (
          <Tag key={key}>{tag}</Tag>
        ))}
      </section>
    );
  }

  // If it's a ReactNode, just render it
  return <section className={styles.infoSection}>{infoContent}</section>;
};
