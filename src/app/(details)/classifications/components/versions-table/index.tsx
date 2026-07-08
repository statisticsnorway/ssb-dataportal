import { Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@digdir/designsystemet-react';
import { VersionItem } from '@/types/item';
import styles from './versionsTable.module.css';

interface VersionsTableProps {
  content: VersionItem[][];
}

const VersionsTable = ({ content }: VersionsTableProps) => {
  const headers = content[0]?.map((item) => item.label) ?? [];
  return (
    <Card className={styles.tableContainer}>
      <Table border={true} zebra={true} hover={true}>
        <TableHead>
          <TableRow className={styles.row}>
            {headers.map((header) => (
              <TableHeaderCell key={header}>{header}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {content.map((row, index) => (
            <TableRow key={index} className={styles.row}>
              {row.map((item, i) => (
                <TableCell key={i}>
                  {item.value instanceof Date ? item.value.toLocaleDateString() : item.value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export { VersionsTable };
