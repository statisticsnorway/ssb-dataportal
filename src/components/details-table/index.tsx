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
                  <Table.HeaderCell className={styles.headerCellPopover}>
                    {row.label}
                    <span popoverTarget='info'>
                      <QuestionmarkCircleIcon
                        fontSize='1.5rem'
                        aria-hidden='true'
                        style={{ marginLeft: '0.5rem', position: 'relative', top: '0.3rem' }}
                      />
                    </span>
                    <Popover placement='top' id='info'>
                      {localization.variableDefinition.unitTypeInfo}
                    </Popover>
                  </Table.HeaderCell>
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
