import { Card, Details, DetailsSummary, Paragraph } from '@digdir/designsystemet-react';
import styles from './expandableTable.module.css';

interface ExpandableTableProps {
  table?: React.ReactNode;
  message?: string;
  title?: string | React.ReactNode;
  ariaLabel?: string;
}

/**
 * ExpandableTable component renders a table inside a collapsible card.
 *
 * @param table - The table content to display inside the expandable section.
 * @param title - The title of the expandable section.
 * @param message - A message to display when the table is not available.
 * @param ariaLabel - The aria-label for the details element for accessibility.
 */
const ExpandableTable = ({ table, title, message, ariaLabel }: ExpandableTableProps) => {
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

export { ExpandableTable };
