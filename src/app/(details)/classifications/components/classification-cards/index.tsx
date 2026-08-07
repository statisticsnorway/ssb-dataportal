import { Card, Divider, Heading, Paragraph, Popover } from '@digdir/designsystemet-react';
import { ArrowRightIcon, QuestionmarkCircleIcon } from '@navikt/aksel-icons';
import { Item } from '@/types/item';
import styles from './classificationCards.module.css';

interface ClassificationCardProps {
  content: Item[];
  message?: string;
  title?: string;
  popoverContent?: string;
}

/**
 * Renders a Card with column aligned description list
 *
 * @param param0
 * @returns
 */
const ClassificationCard = ({ content, title, message, popoverContent }: Readonly<ClassificationCardProps>) => {
  const getColumnKey = (col: Item, index: number) => {
    return typeof col.label === 'string' && col.label.length > 0 ? col.label : String(index);
  };

  return (
    <Card>
      {title && (
        <Heading
          data-size='md'
          level={3}
          className={`${styles.detailsHeading} infoHeadingSecondary`}
          id={`tableHeading-${title}`}
        >
          {title} {<ArrowRightIcon />}
        </Heading>
      )}
      {content ? (
        <dl className={styles.grid}>
          <div className={styles.row}>
            {content.map((col, index) =>
              col.popover ? (
                <dt key={`label-${getColumnKey(col, index)}`} className={`${styles.column} ${styles.popoverKey}`}>
                  <span className={styles.popoverLabel}>{col.label}</span>
                  <Popover.TriggerContext>
                    <Popover.Trigger aria-label={`${col.label} information`} inline className={styles.popoverButton}>
                      <QuestionmarkCircleIcon title='Information' fontSize='2rem' aria-hidden focusable='false' />
                    </Popover.Trigger>
                    <Popover placement='top' id='info'>
                      {popoverContent}
                    </Popover>
                  </Popover.TriggerContext>
                </dt>
              ) : (
                <dt key={`label-${getColumnKey(col, index)}`} className={`${styles.column} ${styles.key}`}>
                  {col.label}
                </dt>
              ),
            )}
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
      ) : (
        <Paragraph className={styles.value}>{message}</Paragraph>
      )}
      <Divider />
    </Card>
  );
};

export { ClassificationCard };
