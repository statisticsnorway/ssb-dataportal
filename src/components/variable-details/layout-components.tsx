import { Heading } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import styles from './layout-components.module.css';

interface SectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export const Section = ({ title, children, className = '' }: SectionProps) => {
  return (
    <section className={`${styles.section} ${className}`}>
      {title && (
        <Heading level={2} data-size='sm' className={styles.sectionTitle}>
          {title}
        </Heading>
      )}
      {children}
    </section>
  );
};

interface InfoPanelProps {
  children: ReactNode;
  columns?: 1 | 2;
  className?: string;
}

export const InfoPanel = ({ children, columns = 1, className = '' }: InfoPanelProps) => {
  return (
    <div 
      className={`${styles.panel} ${columns === 2 ? styles.gridTwoCol : ''} ${className}`}
    >
      {children}
    </div>
  );
};
