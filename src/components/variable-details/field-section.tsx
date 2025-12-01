import { Heading } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import styles from './field-section.module.css';

interface Props {
  title: string;
  children: ReactNode;
}

export const FieldSection = ({ title, children }: Props) => {
  return (
    <section className={styles.fieldSection}>
      <Heading level={2} data-size='sm' className={styles.sectionTitle}>
        {title}
      </Heading>
      <section className={styles.gridTwoCol}>
        {children}
      </section>
    </section>
  );
};
