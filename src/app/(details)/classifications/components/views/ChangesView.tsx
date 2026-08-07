import { Alert, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@digdir/designsystemet-react';
import { useEffect, useState } from 'react';
import { fetchChanges } from '@/libs/data/classifications/codesData';
import {
  ClassificationResource,
  ClassificationVersionResource,
  CodeChangeItem,
  VersionsLanguageEnum,
} from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import { getDayBeforeDate } from '@/utils/dates';
import { sortDatesDescendingSafe } from '@/utils/sort';
import { mapChanges } from '../../utils/details';
import { ClassificationVersionTable } from '../classification-version-table';
import { ExpandableTable } from '../expandable-table';
import styles from './views.module.css';

type GroupedChanges = {
  newCodeKey: string;
  changes: CodeChangeItem[];
};

export default function ChangesView({
  classification,
  version,
}: Readonly<{ classification: ClassificationResource; version: ClassificationVersionResource }>) {
  const sortedVersions =
    [...(classification.versions ?? [])].sort((v1, v2) => sortDatesDescendingSafe(v1.validFrom, v2.validFrom)) ?? [];
  const previousVersion = sortedVersions[sortedVersions.findIndex((v) => v.id === version.id) + 1];
  if (sortedVersions.length <= 1 || previousVersion?.validFrom === undefined || classification.id === undefined)
    return (
      <Alert data-color={'info'} role='status'>
        {localization.versions.noChanges}
      </Alert>
    );

  const startDate: Date = getDayBeforeDate(previousVersion.validFrom);
  const classificationId: number = classification.id;
  const [changes, setChanges] = useState<CodeChangeItem[]>([]);

  const groupedChanges: GroupedChanges[] = changes.reduce<GroupedChanges[]>((groups, change) => {
    const newCodeKey = change.newCode ?? '__undefined_new_code__';
    const existingGroup = groups.find((group) => group.newCodeKey === newCodeKey);

    if (existingGroup) {
      existingGroup.changes.push(change);
      return groups;
    }

    groups.push({
      newCodeKey,
      changes: [change],
    });

    return groups;
  }, []);

  const renderCodeAndName = (code?: string, name?: string, rowSpan?: number, addDivider = false) => (
    <>
      <TableCell rowSpan={rowSpan ?? 1} className={styles.tableCodeLabel}>
        {code ?? '-'}
      </TableCell>
      <TableCell
        rowSpan={rowSpan ?? 1}
        className={addDivider ? `${styles.tableNameLabel} ${styles.tableCentralDivider}` : styles.tableNameLabel}
      >
        {name ?? '-'}
      </TableCell>
    </>
  );

  useEffect(() => {
    const getChanges = async () => {
      setChanges(
        await fetchChanges(
          classificationId,
          startDate,
          version.validTo,
          localization.getLanguage().toUpperCase() as VersionsLanguageEnum,
        ),
      );
    };
    getChanges();
  }, []);

  return (
    <>
      <ExpandableTable
        title={localization.classification.about.changelog}
        table={
          version?.changelogs?.length ? (
            <ClassificationVersionTable
              content={version.changelogs
                .sort((cl1, cl2) => sortDatesDescendingSafe(cl1.changeOccured, cl2.changeOccured))
                .map((c) => mapChanges(c))}
            />
          ) : undefined
        }
        message={version?.changelogs?.length ? undefined : localization.classification.about.noChanges}
      />
      <br />
      {groupedChanges.length < 1 ? (
        <Alert data-color={'info'} role='status'>
          {localization.versions.noChanges}
        </Alert>
      ) : (
        <>
          <Table border={true} zebra={false} hover={false} stickyHeader={true} className={styles.table}>
            <caption>{changes.length} changes to codes from the previous version.</caption>
            <TableHead>
              <TableRow>
                <TableHeaderCell
                  colSpan={2}
                  scope='col'
                  className={`${styles.tableHeader} ${styles.tableCentralDivider}`}
                  key={previousVersion.name}
                >
                  {previousVersion.name}
                </TableHeaderCell>
                <TableHeaderCell colSpan={2} scope='col' className={styles.tableHeader} key={version.name}>
                  {version.name}
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedChanges.flatMap((group) =>
                group.changes.map((change, index) => (
                  <TableRow key={`${group.newCodeKey}-${change.oldCode}-${index}`}>
                    {renderCodeAndName(change.oldCode, change.oldName, 1, true)}
                    {index === 0 ? renderCodeAndName(change.newCode, change.newName, group.changes.length) : null}
                  </TableRow>
                )),
              )}
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
}
