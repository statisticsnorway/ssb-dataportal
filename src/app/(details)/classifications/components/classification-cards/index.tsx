import { Card, Divider, Heading } from '@digdir/designsystemet-react';
import { ArrowRightIcon } from '@navikt/aksel-icons';
import { Item } from '@/types/item';
import styles from './classificationCards.module.css';

interface ClassificationCardProps {
  content: Item[];
  title?: string;
}

/**
 * Renders a Card with column aligned description list
 *
 * @param param0
 * @returns
 */
const ClassificationCard = ({ content, title }: Readonly<ClassificationCardProps>) => {
  const getColumnKey = (col: Item, index: number) => {
    return typeof col.label === 'string' && col.label.length > 0 ? col.label : String(index);
  };

  return (
    <Card>
      {title && (
        <Heading
          level={3}
          className={`${styles.detailsHeading} infoHeadingSecondary`}
          id={`tableHeading-${title}`}
        >
          {title} <ArrowRightIcon className={styles.arrowIcon} />
        </Heading>
      )}
      {content && content.length > 0 ? (
        <dl className={styles.grid}>
          <div className={styles.row}>
            {content.map((col, index) => (
              <dt key={`label-${getColumnKey(col, index)}`} className={`${styles.column} ${styles.key}`}>
                {col.label}
              </dt>
            ))}
          </div>
          <Divider className={styles.row} />
          <div className={styles.row}>
            {content.map((col, index) => (
              <dd key={`value-${getColumnKey(col, index)}`} className={`${styles.column} ${styles.value}`}>
                {col.value}
              </dd>
            ))}
          </div>
        </dl>
      ) : null}
      <Divider />
    </Card>
  );
};

export { ClassificationCard };
