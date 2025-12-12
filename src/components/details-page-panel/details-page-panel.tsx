import { Heading } from '@digdir/designsystemet-react';
import { Item } from '@/types/item';
import { TextField } from '../text-field';
import styles from './details-page-panel.module.css';

interface DetailsPagePanelProps {
  title?: string;
  elements: Item[];
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
        {validElements.map((item, i) => (
          <TextField key={i} {...item} />
        ))}
      </dl>
    </section>
  );
};
