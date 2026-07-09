import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import styles from './versionsTable.module.css';

interface VersionsTableProps {
  content: VersionItem[][];
}

export interface VersionItem {
  label: string;
  value?: ReactNode | string | number | boolean | null | Date;
}

const VersionsTable = ({ content }: VersionsTableProps) => {
  const headers = content[0]?.map((item) => item.label) ?? [];
  return (
    <Table border={true} zebra={true} hover={true} className={styles.table}>
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
              <TableCell key={i}>{item.value instanceof Date ? item.value.toLocaleDateString() : item.value}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export { VersionsTable };
