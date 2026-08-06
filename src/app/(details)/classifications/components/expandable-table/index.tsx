import { Card, Details, DetailsSummary, Paragraph } from '@digdir/designsystemet-react';
import styles from './expandableTable.module.css';

interface ExpandableTableProps {
  table?: React.ReactNode;
  message?: string;
  title?: string;
}
const ExpandableTable = ({ table, title, message }: ExpandableTableProps) => {
  return (
    <Card className={styles.card}>
      <Details className={styles.details}>
        {title && <DetailsSummary>{title}</DetailsSummary>}
        {table && <span className={styles.table}>{table}</span>}
        {message && <Paragraph>{message}</Paragraph>}
      </Details>
    </Card>
  );
};

export { ExpandableTable };
