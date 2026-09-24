import { Card, Details, DetailsSummary, Paragraph } from '@digdir/designsystemet-react';
import styles from './expandableDetails.module.css';

interface ExpandableDetailsProps {
  table?: React.ReactNode;
  message?: string;
  title?: string | React.ReactNode;
  ariaLabel?: string;
}

/**
 * ExpandableDetails component renders details inside a collapsible card.
 *
 * @param table - The content to display inside the expandable section.
 * @param title - The title of the expandable section.
 * @param message - A message to display when the table is not available.
 * @param ariaLabel - The aria-label for the details element for accessibility.
 */
const ExpandableDetails = ({ table, title, message, ariaLabel }: ExpandableDetailsProps) => {
  return (
    <Card className={styles.card}>
      <Details className={styles.details} aria-label={ariaLabel}>
        {title && <DetailsSummary>{title}</DetailsSummary>}
        {table && <span className={styles.table}>{table}</span>}
        {message && <Paragraph lang='no'>{message}</Paragraph>}
      </Details>
    </Card>
  );
};

export { ExpandableDetails };
