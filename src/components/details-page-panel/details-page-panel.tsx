import { Heading } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import { TextField } from '../text-field/text-field';
import styles from './details-page-panel.module.css';

interface DetailsPagePanelProps {
  title?: string;
  elements: { label: string; value: ReactNode; href?: string }[];
  columns?: 1 | 2;
}

export const DetailsPagePanel = ({ title, elements, columns = 1 }: DetailsPagePanelProps) => {
  const validElements = elements.filter(
    ({ value }) => value != null && value !== '' && (!Array.isArray(value) || value.length > 0),
  );

  return (
    <section className={styles.section}>
      {title && (
        <Heading level={2} className={styles.sectionTitle}>
          {title}
        </Heading>
      )}
      <dl className={`${styles.panel} ${columns === 2 ? styles.gridTwoCol : ''}`}>
        {validElements.map(({ label, value, href }, i) => (
          <TextField 
            key={i} 
            label={label} 
            value={value}
            {...(href ? { type: 'link' as const, href } : {})}
          />
        ))}
      </dl>
    </section>
  );
};
