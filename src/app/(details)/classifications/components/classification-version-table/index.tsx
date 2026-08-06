'use client';

import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@digdir/designsystemet-react';
import { VersionItem } from '@/types/item';
import styles from './classificationVersionTable.module.css';

interface ClassificationVersionTableProps {
  content: VersionItem[][];
}

const ClassificationVersionTable = ({ content }: ClassificationVersionTableProps) => {
  const headers = content[0]?.map((item) => item.label) ?? [];
  return (
    <Table border={true} zebra={true} hover={true} className={styles.table}>
      <TableHead>
        <TableRow>
          {headers.map((header) => (
            <TableHeaderCell scope='col' key={header}>
              {header}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {content.map((row) => (
          <TableRow key={row.map((item) => item.value).join('-')}>
            {row.map((item) => (
              <TableCell key={item.label}>
                {item.value instanceof Date ? item.value.toLocaleDateString('nb-NO') : item.value}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export { ClassificationVersionTable };
