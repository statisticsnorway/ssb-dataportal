import { Heading } from '@digdir/designsystemet-react';
import { HTMLAttributes, ReactNode } from 'react';
import styles from './layout-components.module.css';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  children: ReactNode;
}

export const DetailsPageSection = ({ title, children, className, ...rest }: SectionProps) => {
  return (
    <section className={`${styles.section} ${className ?? ''}`} {...rest}>
      {title && (
        <Heading level={2} data-size='sm' className={styles.sectionTitle}>
          {title}
        </Heading>
      )}
      {children}
    </section>
  );
};

