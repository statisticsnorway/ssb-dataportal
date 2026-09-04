import { Card, Divider, Heading, Popover } from '@digdir/designsystemet-react';
import { QuestionmarkCircleIcon } from '@navikt/aksel-icons';
import { localization } from '@/libs/language/src/localization';
import { Item, Visibility } from '@/types/item';
import styles from './detailsList.module.css';

interface DetailsListProps {
  title?: string;
  content: Item[];
  popoverContent?: string;
  fallbackLanguage?: string;
  allowedVisibility?: Visibility;
}

const DetailsList = ({ title, content, popoverContent, fallbackLanguage, allowedVisibility }: DetailsListProps) => {
  const getRowKey = (row: Item, index: number) => {
    return typeof row.label === 'string' && row.label.length > 0 ? row.label : String(index);
  };

  const setHtmlLang = (value?: React.ReactNode) => {
    if (value && value !== localization.noDataPlaceholder) {
      return fallbackLanguage ? { lang: fallbackLanguage } : {};
    }
    return {};
  };

  const visibleRows = content.filter((row) => {
    if (allowedVisibility === undefined) {
      return true;
    }

    return row.visibility?.has(allowedVisibility) ?? true;
  });

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
      {visibleRows.map((row, index) => (
        <dl key={getRowKey(row, index)} className={styles.row}>
          {row.popover ? (
            <dt className={styles.popoverKey} aria-label={row.label}>
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
          <dd className={styles.value} aria-label={row.label} {...setHtmlLang(row.value)}>
            {row.value}
          </dd>
          {index != visibleRows.length - 1 && <Divider />}
        </dl>
      ))}
    </Card>
  );
};

export { DetailsList };
