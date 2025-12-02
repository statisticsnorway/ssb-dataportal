import { Heading } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import styles from './layout-components.module.css';
import { TextField } from '../text-field/text-field';


interface DetailsPagePanelPanelProps {
  title?: string;
  elements: { label: string; value: ReactNode; href?: string | undefined }[];
  columns?: 1 | 2;
}


export const DetailsPagePanel = ({ title, elements, columns = 1 }: DetailsPagePanelPanelProps) => {
  return (
    <section className={styles.section}>
      {title && (
        <Heading level={2} data-size='sm' className={styles.sectionTitle}>
          {title}
        </Heading>
      )}
      <dl className={`${styles.panel} ${columns === 2 ? styles.gridTwoCol : ''}`}>
        {elements.map((element, index) => (
          <TextField key={index} label={element.label} value={element.value} href={element.href} />
        ))}
      </dl>
    </section>
  );
};