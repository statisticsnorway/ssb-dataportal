import { Card, Divider, Heading, Popover } from '@digdir/designsystemet-react';
import { QuestionmarkCircleIcon } from '@navikt/aksel-icons';
import { localization } from '@/libs/language/src/localization';
import { Item } from '@/types/item';
import styles from './detailsList.module.css';

interface DetailsListProps {
  title?: string;
  content: Item[];
  popoverContent?: string;
  fallbackLanguage?: string;
}

const DetailsList = ({ title, content, popoverContent, fallbackLanguage }: DetailsListProps) => {
  const getRowKey = (row: Item, index: number) => {
    return typeof row.label === 'string' && row.label.length > 0 ? row.label : String(index);
  };

  const setHtmlLang = (value?: React.ReactNode) =>
    value && value !== localization.classification.about.notRelevant
      ? fallbackLanguage
        ? { lang: fallbackLanguage }
        : {}
      : {};
  return (
    <Card className={styles.tableContainer}>
      {title && (
        <Heading
          level={2}
          className={`${styles.detailsHeading} infoHeadingSecondary`}
          data-size='md'
          id={`tableHeading-${title}`}
          {...(fallbackLanguage ? { lang: fallbackLanguage } : {})}
        >
          {title}
        </Heading>
      )}
      {content.map((row, index) => (
        <dl key={getRowKey(row, index)} className={styles.row}>
          {row.popover ? (
            <dt className={styles.popoverKey}>
              <span className={styles.popoverLabel}>{row.label}</span>
              <Popover.TriggerContext>
                <Popover.Trigger aria-label={`${row.label} information`} inline className={styles.popoverButton}>
                  <QuestionmarkCircleIcon title='Information' fontSize='2rem' aria-hidden focusable='false' />
                </Popover.Trigger>
                <Popover placement='top' id='info'>
                  {popoverContent}
                </Popover>
              </Popover.TriggerContext>
            </dt>
          ) : (
            <dt className={styles.key}>{row.label}</dt>
          )}
          <dd className={styles.value} {...setHtmlLang(row.value)}>
            {row.value}
          </dd>
          <Divider />
        </dl>
      ))}
    </Card>
  );
};

export { DetailsList };
