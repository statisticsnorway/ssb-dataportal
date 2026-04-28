import { Card, Heading, Popover, Table, TableBody, TableCell, TableRow } from '@digdir/designsystemet-react';
import { QuestionmarkCircleIcon } from '@navikt/aksel-icons';
import { localization } from '@/libs/language/src/localization';
import { Item } from '@/types/item';
import styles from './detailsTable.module.css';

interface DetailsTableProps {
  title: string;
  content: Item[];
}

const DetailsTable = ({ title, content }: DetailsTableProps) => {
  return (
    <Card className={styles.tableContainer}>
      <Heading level={2} data-size='md' id={`tableHeading-${title}`}>
        {title}
      </Heading>
      <Table className={styles.detailsTable}>
        <TableBody className={styles.tableBody}>
          {content.map((row, index) => (
            <TableRow key={index}>
              {row.popover ? (
                <>
                  <Table.HeaderCell popoverTarget='info' className={styles.headerCell}>
                    {row.label}
                    <QuestionmarkCircleIcon aria-hidden='true' style={{ marginLeft: '0.5rem' }} />
                  </Table.HeaderCell>
                  <Popover placement='left' id='info'>
                    {localization.variableDefinition.unitTypeInfo}
                  </Popover>
                </>
              ) : (
                <Table.HeaderCell className={styles.headerCell}>{row.label}</Table.HeaderCell>
              )}
              <TableCell className={styles.contentCell}>{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export { DetailsTable };
