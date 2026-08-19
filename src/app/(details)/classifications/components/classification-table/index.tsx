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
  fallbackLanguage?: string;
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
 * matching one of the header labels. The sortable column defaults to
 * descending order (newest first); clicking the header toggles between
 * descending and ascending. Sorting is stable-ish and handles `Date`, strings,
 * numbers and nullish values via the local `compare` helper.
 *
 * @param props - Component props
 * @param props.content - 2D array of `VersionItem`s; outer array = rows, inner array = cells
 * @param props.sortableField - Optional header label of the column that should be sortable
 * @returns The rendered classification version table
 */
const ClassificationTable = ({ content, sortableField, fallbackLanguage }: ClassificationTableProps) => {
  const headers = content[0]?.map((item) => item.label) ?? [];
  const sortableIndex = sortableField ? headers.indexOf(sortableField) : -1;

  const [sortDirection, setSortDirection] = useState<TableHeaderCellProps['sort']>('descending');

  const handleSort = () => {
    setSortDirection((prev) => (prev === 'descending' ? 'ascending' : 'descending'));
  };

  const sortedContent =
    sortableIndex >= 0
      ? [...content].sort((rowA, rowB) => {
          const a = rowA[sortableIndex]?.value;
          const b = rowB[sortableIndex]?.value;
          if (a === undefined || b === undefined) return 0;
          const result = compare(a, b);
          return sortDirection === 'ascending' ? result : -result;
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
                sort={isSortable ? sortDirection : undefined}
                onClick={isSortable ? handleSort : undefined}
              >
                {header}
              </TableHeaderCell>
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedContent.map((row, rowIndex) => (
          <TableRow key={`${row.map((item) => String(item.value)).join('-')}-${rowIndex}`}>
            {row.map((item) => (
              <TableCell {...(fallbackLanguage ? { lang: fallbackLanguage } : {})} key={item.label}>
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
