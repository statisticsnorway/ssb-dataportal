import { Heading } from '@digdir/designsystemet-react';
import { Roboto_Condensed } from 'next/font/google';
import { TextField } from '@/components/text-field';
import { Item } from '@/types/item';
import styles from './details-page-panel.module.css';

const robotoCondensed = Roboto_Condensed({ subsets: ['latin-ext'] });

interface DetailsPagePanelProps {
  title?: string;
  elements: Item[];
  columns?: 1 | 2;
}

export const DetailsPagePanel = ({ title, elements, columns = 1 }: DetailsPagePanelProps) => {
  return (
    <section className={styles.section}>
      {title && (
        <Heading level={2} className={`${styles.sectionTitle} ${robotoCondensed.className}`}>
          {title}
        </Heading>
      )}
      <dl className={styles.panel} data-columns={columns}>
        {elements.map((item, i) => (
          <TextField key={i} {...item} />
        ))}
      </dl>
    </section>
  );
};
