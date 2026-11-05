import { Heading } from '@digdir/designsystemet-react';
import { type ReactNode, useId } from 'react';
import styles from './filter-section.module.css';

type FilterSectionProps = Readonly<{
  title: string;
  children: ReactNode;
  className?: string;
}>;

export function FilterSection({ title, children, className }: FilterSectionProps) {
  const titleId = useId();

  return (
    <section className={[styles.section, className].filter(Boolean).join(' ')} aria-labelledby={titleId}>
      <div className={styles.header}>
        <Heading id={titleId} level={3} data-size='sm' className={styles.title}>
          {title}
        </Heading>
      </div>
      {children}
    </section>
  );
}
