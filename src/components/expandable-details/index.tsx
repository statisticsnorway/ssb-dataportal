import { Card, Details, DetailsSummary, Paragraph } from '@digdir/designsystemet-react';
import styles from './expandableDetails.module.css';

interface ExpandableDetailsProps {
  table?: React.ReactNode;
  message?: string;
  title?: string | React.ReactNode;
  ariaLabel?: string;
  variant?: 'default' | 'seamless';
}

/**
 * ExpandableDetails component renders details inside a collapsible card.
 *
 * @param table - The content to display inside the expandable section.
 * @param title - The title of the expandable section.
 * @param message - A message to display when the table is not available.
 * @param ariaLabel - The aria-label for the details element for accessibility.
 * @param variant - `seamless` renders the table flush inside the card on the SSB secondary colour scale.
 */
const ExpandableDetails = ({ table, title, message, ariaLabel, variant = 'default' }: ExpandableDetailsProps) => {
  const isSeamless = variant === 'seamless';

  return (
    <Card className={isSeamless ? `${styles.card} ${styles.seamlessCard}` : styles.card}>
      <Details className={styles.details} aria-label={ariaLabel}>
        {title && <DetailsSummary>{title}</DetailsSummary>}
        {table && <div className={styles.table}>{table}</div>}
        {message && <Paragraph lang='no'>{message}</Paragraph>}
      </Details>
    </Card>
  );
};

export { ExpandableDetails };
