import { Heading } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import { TextField } from '../text-field/text-field';
import styles from './details-page-panel.module.css';

interface DetailsPagePanelProps {
  title?: string;
  elements: { label: string; value: ReactNode; href?: string }[];
  columns?: 1 | 2;
}

export const DetailsPagePanel = ({ title, elements, columns = 1 }: DetailsPagePanelProps) => (
  <section className={styles.section}>
    {title && (
      <Heading level={2} data-size="sm" className={styles.sectionTitle}>
        {title}
      </Heading>
    )}
    <dl className={`${styles.panel} ${columns === 2 ? styles.gridTwoCol : ''}`}>
      {elements.map(({ label, value, href }, i) => (
        <TextField key={i} label={label} value={value} href={href} />
      ))}
    </dl>
  </section>
);
