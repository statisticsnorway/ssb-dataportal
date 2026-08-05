import { Card, Details, DetailsSummary } from '@digdir/designsystemet-react';
import styles from './expandableTable.module.css';

interface ExpandableTableProps {
  table: React.ReactNode;
  title?: string;
}
const ExpandableTable = ({ table, title }: ExpandableTableProps) => {
  return (
    <Card className={styles.card}>
      <Details className={styles.details}>
        {title && <DetailsSummary>{title}</DetailsSummary>}
        <span className={styles.table}>{table}</span>
      </Details>
    </Card>
  );
};

export { ExpandableTable };
