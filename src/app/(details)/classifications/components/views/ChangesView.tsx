import {
  Alert,
  Button,
  Card,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@digdir/designsystemet-react';
import { useEffect, useMemo, useState } from 'react';
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
import { groupChanges } from '../../utils/changes';
import { mapChanges } from '../../utils/details';
import { ClassificationTable } from '../classification-table';
import { ExpandableTable } from '../expandable-table';
import styles from './views.module.css';

export default function ChangesView({
  classification,
  version,
}: Readonly<{ classification: ClassificationResource; version: ClassificationVersionResource }>) {
  const sortedVersions =
    [...(classification.versions ?? [])].toSorted((v1, v2) => sortDatesDescendingSafe(v1.validFrom, v2.validFrom)) ??
    [];
  const previousVersion = sortedVersions[sortedVersions.findIndex((v) => v.id === version.id) + 1];
  const [inverted, setInverted] = useState(false);

  const hasPreviousVersion =
    sortedVersions.length > 1 && previousVersion?.validFrom !== undefined && classification.id !== undefined;
  const changesFrom = useMemo(() => {
    if (!hasPreviousVersion || !previousVersion?.validFrom) {
      return null;
    }

    return getDayBeforeDate(previousVersion.validFrom as Date);
  }, [hasPreviousVersion, previousVersion?.validFrom]);

  const [changes, setChanges] = useState<CodeChangeItem[] | null>(null);

  const handleInvertTable = () => setInverted((v) => !v);

  useEffect(() => {
    if (!hasPreviousVersion || !changesFrom || classification.id === undefined) {
      return;
    }

    const getChanges = async () => {
      setChanges(
        await fetchChanges(
          classification.id as number,
          changesFrom,
          version.validTo,
          localization.getLanguage().toUpperCase() as VersionsLanguageEnum,
        ),
      );
    };
    getChanges();
  }, [hasPreviousVersion, classification.id, changesFrom?.getTime(), version.validTo?.getTime()]);

  const groupedChanges = groupChanges(changes ?? [], inverted);

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

  const renderChangesContent = () => {
    if (!hasPreviousVersion || !previousVersion) {
      return (
        <Alert data-color={'info'} role='status'>
          {localization.versions.noChanges}
        </Alert>
      );
    }

    if (changes === null) {
      return <Spinner aria-label={localization.loading.results} />;
    }

    if (groupedChanges.length < 1) {
      return (
        <Alert data-color={'info'} role='status'>
          {localization.versions.noChanges}
        </Alert>
      );
    }

    return (
      <Card>
        <figure className={styles.tableFigure} aria-labelledby='code-changes-caption'>
          <figcaption id='code-changes-caption' className={styles.tableToolbar}>
            <span>
              {localization.formatString(localization.versions.codeChangesForVersion, {
                numberOfChanges: changes.length,
              })}
            </span>
            <Button variant='secondary' onClick={handleInvertTable}>
              {localization.versions.invert}
            </Button>
          </figcaption>
          <Table border={true} zebra={false} hover={false} stickyHeader={true} className={styles.table}>
            <TableHead>
              <TableRow>
                <TableHeaderCell
                  colSpan={2}
                  scope='col'
                  className={`${styles.tableHeader} ${styles.tableCentralDivider}`}
                  key={previousVersion.name ?? 'previous'}
                >
                  {previousVersion.name ?? '-'}
                </TableHeaderCell>
                <TableHeaderCell colSpan={2} scope='col' className={styles.tableHeader} key={version.name ?? 'current'}>
                  {version.name ?? '-'}
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedChanges.flatMap((group) =>
                group.changes.map((change, index) => {
                  const leftCode = inverted ? change.newCode : change.oldCode;
                  const leftName = inverted ? change.newName : change.oldName;
                  const rightCode = inverted ? change.oldCode : change.newCode;
                  const rightName = inverted ? change.oldName : change.newName;

                  return (
                    <TableRow key={`${group.newCodeKey}-${leftCode ?? 'none'}-${index}`}>
                      {renderCodeAndName(leftCode, leftName, 1, true)}
                      {index === 0 ? renderCodeAndName(rightCode, rightName, group.changes.length) : null}
                    </TableRow>
                  );
                }),
              )}
            </TableBody>
          </Table>
        </figure>
      </Card>
    );
  };

  return (
    <>
      <ExpandableTable
        title={localization.classification.about.changelog}
        table={
          version?.changelogs?.length ? (
            <ClassificationTable
              content={version.changelogs
                .toSorted((cl1, cl2) => sortDatesDescendingSafe(cl1.changeOccured, cl2.changeOccured))
                .map((c) => mapChanges(c))}
            />
          ) : undefined
        }
        message={version?.changelogs?.length ? undefined : localization.classification.about.noChanges}
      />
      <br />
      {renderChangesContent()}
    </>
  );
}
