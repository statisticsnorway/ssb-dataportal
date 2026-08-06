'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  type TableHeaderCellProps,
  TableRow,
} from '@digdir/designsystemet-react';
import { useState } from 'react';
import { VersionItem } from '@/types/item';
import styles from './classificationTable.module.css';

interface ClassificationTableProps {
  content: VersionItem[][];
  sortableField?: string;
}

const compare = (a: VersionItem['value'], b: VersionItem['value']) => {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

/**
 * Renders a table of classification data.
 *
 * Each row in `content` is an array of `VersionItem`s where the `label` of the
 * first row's items is used as the column headers. Cell values are rendered
 * as-is, except `Date` values which are formatted with `nb-NO` locale.
 *
 * Optionally, a single column can be made sortable by passing `sortableField`
 * matching one of the header labels. Clicking that header cycles through:
 * unsorted → ascending → descending → unsorted. Sorting is stable-ish and
 * handles `Date`, strings, numbers and nullish values via the local `compare`
 * helper.
 *
 * @param props - Component props
 * @param props.content - 2D array of `VersionItem`s; outer array = rows, inner array = cells
 * @param props.sortableField - Optional header label of the column that should be sortable
 * @returns The rendered classification version table
 */
const ClassificationTable = ({ content, sortableField }: ClassificationTableProps) => {
  const headers = content[0]?.map((item) => item.label) ?? [];
  const sortableIndex = sortableField ? headers.indexOf(sortableField) : -1;

  const [sortDirection, setSortDirection] = useState<TableHeaderCellProps['sort']>(undefined);

  const handleSort = () => {
    setSortDirection((prev) => {
      if (prev === undefined) return 'ascending';
      if (prev === 'ascending') return 'descending';
      return undefined;
    });
  };

  const sortedContent =
    sortableIndex >= 0 && sortDirection
      ? [...content].sort((rowA, rowB) => {
          const a = rowA[sortableIndex]?.value;
          const b = rowB[sortableIndex]?.value;
          if (a === undefined || b === undefined) return 0;
          return sortDirection === 'ascending' ? compare(a, b) : compare(b, a);
        })
      : content;

  return (
    <Table border={true} zebra={true} hover={true} className={styles.table}>
      <TableHead>
        <TableRow>
          {headers.map((header, index) => {
            const isSortable = index === sortableIndex;
            return (
              <TableHeaderCell
                scope='col'
                key={header}
                sort={isSortable ? (sortDirection ?? 'none') : undefined}
                onClick={isSortable ? handleSort : undefined}
              >
                {header}
              </TableHeaderCell>
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedContent.map((row) => (
          <TableRow key={row.map((item) => String(item.value)).join('-')}>
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

export { ClassificationTable };
