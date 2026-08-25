import { Alert, Spinner } from '@digdir/designsystemet-react';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { fetchChanges } from '@/libs/data/classifications/codesData';
import {
  ClassificationResource,
  ClassificationVersionResource,
  CodeChangeItem,
  CorrespondenceMapResource,
  VersionsLanguageEnum,
} from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import { getDayBeforeDate } from '@/utils/dates';
import { sortDatesDescendingSafe } from '@/utils/sort';
import { mapChanges } from '../../utils/details';
import { buildDownloadHref } from '../../utils/download-urls';
import { ClassificationTable } from '../classification-table';
import { CorrespondenceTable } from '../correspondence-table';
import { ExpandableTable } from '../expandable-table';

export default function ChangesView({
  classification,
  version,
}: Readonly<{ classification: ClassificationResource; version: ClassificationVersionResource }>) {
  const pathname = usePathname();
  const sortedVersions =
    [...(classification.versions ?? [])].toSorted((v1, v2) => sortDatesDescendingSafe(v1.validFrom, v2.validFrom)) ??
    [];
  const previousVersion = sortedVersions[sortedVersions.findIndex((v) => v.id === version.id) + 1];

  const hasPreviousVersion =
    sortedVersions.length > 1 && previousVersion?.validFrom !== undefined && classification.id !== undefined;
  const changesFrom = useMemo(() => {
    if (!hasPreviousVersion || !previousVersion?.validFrom) {
      return null;
    }

    return getDayBeforeDate(previousVersion.validFrom as Date);
  }, [hasPreviousVersion, previousVersion?.validFrom]);

  const [changes, setChanges] = useState<CodeChangeItem[] | null>(null);

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

  const mappings = useMemo<CorrespondenceMapResource[]>(
    () =>
      (changes ?? []).map((change) => ({
        sourceCode: change.newCode ?? '-',
        sourceName: change.newName ?? '-',
        targetCode: change.oldCode ?? '-',
        targetName: change.oldName ?? '-',
      })),
    [changes],
  );

  const handleOpenDownloadRoute = () => {
    window.location.href = buildDownloadHref(pathname, {
      format: 'csv',
      language: localization.getLanguage() as 'nb' | 'nn' | 'en',
    });
  };

  const renderCodeChanges = () => {
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

    if (mappings.length < 1) {
      return (
        <Alert data-color={'info'} role='status'>
          {localization.versions.noChanges}
        </Alert>
      );
    }

    return (
      <CorrespondenceTable
        sourceName={previousVersion.name ?? localization.noDataPlaceholder}
        targetName={version.name ?? localization.noDataPlaceholder}
        mappings={mappings}
        downloadHref={buildDownloadHref(pathname, {
          format: 'csv',
          language: localization.getLanguage() as 'nb' | 'nn' | 'en',
        })}
        onDownloadClick={handleOpenDownloadRoute}
      />
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
      <p>
        {localization.formatString(localization.versions.codeChangesForVersion, {
          numberOfChanges: changes?.length || localization.noDataPlaceholder,
        })}
      </p>
      {renderCodeChanges()}
    </>
  );
}
