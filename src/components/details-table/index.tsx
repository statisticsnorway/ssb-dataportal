import { Card, Heading, Table, TableBody, TableCell, TableRow } from '@digdir/designsystemet-react';
import { DisplayField } from '@/types/displayField';
import styles from './detailsTable.module.css';

interface DetailsTableProps {
  title: string;
  content: DisplayField[];
}

const DetailsTable = ({ title, content }: DetailsTableProps) => {
  return (
    <Card className={styles.tableContainer}>
      <Heading level={2} data-size='md' className={styles.tableHeading} id='tableHeading'>
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
