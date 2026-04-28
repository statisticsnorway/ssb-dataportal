import { Card, Divider, Heading, Popover } from '@digdir/designsystemet-react';
import { QuestionmarkCircleIcon } from '@navikt/aksel-icons';
import { Item } from '@/types/item';
import styles from './detailsList.module.css';

interface DetailsListProps {
  title: string;
  content: Item[];
  popoverContent?: string;
}

const DetailsList = ({ title, content, popoverContent }: DetailsListProps) => {
  return (
    <Card className={styles.tableContainer}>
      <Heading level={2} data-size='md' id={`tableHeading-${title}`}>
        {title}
      </Heading>
      {content.map((row, index) => (
        <dl key={index} className={styles.row}>
          {row.popover ? (
            <>
              <dt className={styles.popoverKey}>
                <span className={styles.popoverLabel}>{row.label}</span>
                <Popover.TriggerContext>
                  <Popover.Trigger className={styles.popoverButton}>
                    <QuestionmarkCircleIcon fontSize='2rem' aria-hidden='true' />
                  </Popover.Trigger>
                  <Popover placement='top' id='info'>
                    {popoverContent}
                  </Popover>
                </Popover.TriggerContext>
              </dt>
            </>
          ) : (
            <dt className={styles.key}>{row.label}</dt>
          )}
          <dd className={styles.value}>{row.value}</dd>
          <Divider />
        </dl>
      ))}
    </Card>
  );
};

export { DetailsList as DetailsTable };
