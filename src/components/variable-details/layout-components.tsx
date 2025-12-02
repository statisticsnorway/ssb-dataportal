import { Heading } from '@digdir/designsystemet-react';
import { HTMLAttributes, ReactNode } from 'react';
import styles from './layout-components.module.css';

interface SectionProps {
  title?: string;
  children: ReactNode;
}

export const DetailsPageSection = ({ title, children }: SectionProps) => {
  return (
    <section className={styles.section}>
      {title && (
        <Heading level={2} data-size='sm' className={styles.sectionTitle}>
          {title}
        </Heading>
      )}
      {children}
    </section>
  );
};

