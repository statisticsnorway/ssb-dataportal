import { Card, Heading, Table, TableBody, TableCell, TableRow } from '@digdir/designsystemet-react';
import { Item } from '@/types/item';
import styles from './detailsTable.module.css';

interface DetailsTableProps {
  title: string;
  content: Item[];
}

const DetailsTable = ({ title, content }: DetailsTableProps) => {
  return (
    <Card className={styles.tableContainer}>
      <Heading level={3} data-size='lg' className={styles.tableHeading}>
        {title}
      </Heading>
      <Table className={styles.detailsTable}>
        <TableBody className={styles.tableBody}>
          {content.map((row, index) => (
            <TableRow key={index}>
              <Table.HeaderCell className={styles.headerCell}>{row.label}</Table.HeaderCell>
              <TableCell className={styles.contentCell}>{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export { DetailsTable };
