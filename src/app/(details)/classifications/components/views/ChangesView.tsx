import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@digdir/designsystemet-react';
import styles from './views.module.css';

const content = [
  [
    { label: '0202 this code', value: '0202 this code' },
    { label: '0201 that code', value: '0201 that code' },
  ],
];

export default function ChangesView() {
  // Work out from and to dates based on relevant versions
  // Get changes from endpoint e.g. http https://data.ssb.no/api/klass/v1/classifications/131/changes\?from\=2025-01-01
  // Shall we filter "identical" changes out?
  return (
    <Table border={true} zebra={true} hover={true} className={styles.table}>
      <TableHead>
        <TableRow>
          <TableHeaderCell key='Version 1'>Version 1</TableHeaderCell>
          <TableHeaderCell key='Version 2'>Version 2</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {content.map((row) => (
          <TableRow key={row.map((item) => item.value).join('-')}>
            {row.map((item) => (
              <TableCell key={item.label}>{item.value}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
