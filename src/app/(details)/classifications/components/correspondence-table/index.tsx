'use client';

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@digdir/designsystemet-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { CorrespondenceMapResource } from '@/libs/data-access/klass/models';
import { localization } from '@/libs/language';
import styles from './correspondenceTable.module.css';

interface CorrespondenceTableProps {
  sourceName: string;
  targetName: string;
  mappings: CorrespondenceMapResource[];
  downloadHref: string;
}

interface MappingGroup {
  key: string;
  sourceCode?: string | null;
  sourceName?: string | null;
  targets: Array<{
    code?: string | null;
    name?: string | null;
  }>;
}

function groupMappings(mappings: CorrespondenceMapResource[], inverted: boolean): MappingGroup[] {
  const groups = new Map<string, MappingGroup>();

  for (const mapping of mappings) {
    const sourceCode = inverted ? mapping.targetCode : mapping.sourceCode;
    const sourceName = inverted ? mapping.targetName : mapping.sourceName;
    const target = {
      code: inverted ? mapping.sourceCode : mapping.targetCode,
      name: inverted ? mapping.sourceName : mapping.targetName,
    };
    const key = JSON.stringify([sourceCode ?? null, sourceName ?? null]);
    const existingGroup = groups.get(key);

    if (existingGroup) {
      existingGroup.targets.push(target);
    } else {
      groups.set(key, { key, sourceCode, sourceName, targets: [target] });
    }
  }

  return [...groups.values()];
}

function renderCodeAndName(
  code?: string | null,
  name?: string | null,
  rowSpan = 1,
  addDivider = false,
  removeBottomBorder = false,
) {
  const hasMapping = Boolean(code || name);
  const codeClassName = removeBottomBorder
    ? `${styles.tableCodeLabel} ${styles.tableBottomCell}`
    : styles.tableCodeLabel;
  const nameClassName = [
    styles.tableNameLabel,
    addDivider ? styles.tableCentralDivider : null,
    removeBottomBorder ? styles.tableBottomCell : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <TableCell rowSpan={rowSpan} className={codeClassName}>
        {code ?? '-'}
      </TableCell>
      <TableCell rowSpan={rowSpan} className={nameClassName}>
        {hasMapping ? (name ?? '-') : localization.classification.correspondence.noTarget}
      </TableCell>
    </>
  );
}

export function CorrespondenceTable({
  sourceName,
  targetName,
  mappings,
  downloadHref,
}: Readonly<CorrespondenceTableProps>) {
  const [inverted, setInverted] = useState(false);
  const displayedSourceName = inverted ? targetName : sourceName;
  const displayedTargetName = inverted ? sourceName : targetName;
  const groupedMappings = useMemo(() => groupMappings(mappings, inverted), [mappings, inverted]);

  return (
    <section>
      <div className={styles.toolbar}>
        <Button variant='secondary' onClick={() => setInverted((current) => !current)}>
          {localization.versions.invert}
        </Button>
        <Button asChild variant='secondary'>
          <Link href={downloadHref}>{localization.classification.download.button}</Link>
        </Button>
      </div>

      <div className={styles.tableWrapper}>
        <Table
          border={true}
          zebra={false}
          hover={true}
          stickyHeader={true}
          className={styles.table}
          aria-label={localization.classification.correspondence.tableLabel}
        >
          <TableHead>
            <TableRow>
              <TableHeaderCell
                colSpan={2}
                scope='col'
                className={`${styles.tableHeader} ${styles.tableCentralDivider}`}
              >
                {displayedSourceName}
              </TableHeaderCell>
              <TableHeaderCell colSpan={2} scope='col' className={styles.tableHeader}>
                {displayedTargetName}
              </TableHeaderCell>
            </TableRow>
          </TableHead>

          {groupedMappings.map((group, groupIndex) => {
            const isLastGroup = groupIndex === groupedMappings.length - 1;

            return (
              <TableBody key={group.key} className={styles.mappingGroup}>
                {group.targets.map((target, index) => (
                  <TableRow key={`${group.key}-${target.code ?? 'missing'}-${index}`}>
                    {index === 0
                      ? renderCodeAndName(group.sourceCode, group.sourceName, group.targets.length, true, isLastGroup)
                      : null}
                    {renderCodeAndName(target.code, target.name)}
                  </TableRow>
                ))}
              </TableBody>
            );
          })}
        </Table>
      </div>
    </section>
  );
}
