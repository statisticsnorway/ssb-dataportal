import {
  Heading,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@digdir/designsystemet-react';
import { useEffect, useState } from 'react';
import { fetchChanges } from '@/libs/data/classifications/codesData';
import { ClassificationResource, ClassificationVersionResource, CodeChangeItem } from '@/libs/data-access/klass';
import { getDayBeforeDate } from '@/utils/dates';
import styles from './views.module.css';

export default function ChangesView({
  classification,
  version,
}: Readonly<{ classification: ClassificationResource; version: ClassificationVersionResource }>) {
  // Shall we filter "identical" changes out?
  const sortedVersions = classification.versions?.sort((v1, v2) => v2.validFrom - v1.validFrom) ?? [];
  const previousVersion = sortedVersions[sortedVersions.findIndex((v) => v.id === version.id) + 1];
  if (
    sortedVersions.length <= 1 ||
    previousVersion === undefined ||
    previousVersion.validFrom === undefined ||
    classification.id === undefined
  )
    return <p>No changes related to this version</p>;

  const startDate: Date = getDayBeforeDate(previousVersion.validFrom);
  const classificationId: number = classification.id;
  const [changes, setChanges] = useState<CodeChangeItem[]>([]);

  useEffect(() => {
    const getChanges = async () => {
      setChanges(await fetchChanges(classificationId, startDate, version.validTo));
    };
    getChanges();
  }, []);

  return (
    <>
      <Heading>Versions</Heading>
      <p>{`Current version: ${version.name}`}</p>
      <p>{`Previous version: ${previousVersion?.name}`}</p>
      <Heading>Changes</Heading>
      <Table border={true} zebra={true} hover={true} className={styles.table}>
        <TableHead>
          <TableRow>
            <TableHeaderCell key={previousVersion.name}>{previousVersion.name}</TableHeaderCell>
            <TableHeaderCell key={version.name}>{version.name}</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {changes.map((change) => (
            <TableRow key={`${change.oldCode} - ${change.newCode}`}>
              <TableCell key={change.oldCode}>{change.oldName}</TableCell>
              <TableCell key={change.newCode}>{change.newName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
