'use client';

import { Badge, Card, Heading, Tag } from '@digdir/designsystemet-react';
import { notFound } from 'next/navigation';
import { parseAsString, useQueryStates } from 'nuqs';
import { useMemo } from 'react';
import { tabsData } from '@/app/(services)/tabs';
import { useAuthContext } from '@/app/authContext';
import { useTimelineData } from '@/components/data-coverage-timeline';
import DataCoverageTimeline from '@/components/data-coverage-timeline/dataCoverageTimeline';
import type { Slot } from '@/components/data-coverage-timeline/types';
import { DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { DetailsList } from '@/components/details-list';
import { ExternalLink } from '@/components/link-components/externalLink';
import { CopyTag } from '@/components/tag-components/copy-tag';
import { DaplaDataFileDTO, DatasetDTO, DatasetVariableDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';
import { clientLogger } from '@/libs/logger/client-logger';
import { Visibility } from '@/types/item';
import { getDaplaCtrlUrl } from '@/utils/config';
import { convertAssessment, convertDataSetState } from '@/utils/functions';
import { sortDateStringsDescending } from '@/utils/sort';
import { DataFileSearchHit } from '../../components/DataFileSearchHit';
import { listDatasetVariableDataFilePaths, listDatasetVariableIdsInPeriod } from './actions';
import DatasetVariableList from './DatasetVariableList';
import styles from './dataset-page.module.css';
import workspaceStyles from './dataset-workspace.module.css';
import { DatasetFilters, type FilterState, getSelectedPeriods, type TimelinePeriodSlot } from './datasetFilters';
import { useDebouncedLoad } from './useDebouncedLoad';

function getPeriodIndexes(
  timelinePeriods: TimelinePeriodSlot[],
  start: string | null,
  end: string | null,
): FilterState['period'] {
  const startIndex = timelinePeriods.findIndex((period) => period.start === start);
  const endIndex = timelinePeriods.findIndex((period) => period.end === end);
  return startIndex >= 0 && endIndex >= startIndex ? [startIndex, endIndex] : null;
}

function getDatasetFilterState(
  timelinePeriods: TimelinePeriodSlot[],
  query: { q: string; periodFrom: string | null; periodTo: string | null },
  canFilterVariables: boolean,
  isValid: boolean,
): FilterState {
  if (!canFilterVariables) return { search: '', period: null };

  return {
    search: query.q,
    period: isValid ? getPeriodIndexes(timelinePeriods, query.periodFrom, query.periodTo) : null,
  };
}

function DatasetAbout({
  dataset,
  isAuthenticated,
  totalNamingStandardViolations,
}: Readonly<{
  dataset: DatasetDTO;
  isAuthenticated: boolean;
  totalNamingStandardViolations: number;
}>) {
  return (
    <DetailsList
      title={localization.datasetDetail.aboutDataset}
      allowedVisibility={isAuthenticated ? Visibility.INTERNAL : Visibility.EXTERNAL}
      content={[
        { label: localization.datasetDetail.dataProduct, value: dataset.product_short_name },
        { label: localization.datasetDetail.bucket, value: dataset.storage_location_name },
        {
          label: localization.datasetDetail.datasetState,
          value: dataset.dataset_state && <Tag data-color='magic'>{convertDataSetState(dataset.dataset_state)}</Tag>,
        },
        {
          label: localization.datasetDetail.assessment,
          value: dataset.assessment && <Tag data-color='magic'> {convertAssessment(dataset.assessment)}</Tag>,
        },
        {
          label: localization.datasetDetail.responsible,
          value: (
            <ExternalLink linkText={dataset.owner ?? 'undefined'} href={`${getDaplaCtrlUrl()}/team/${dataset.owner}`} />
          ),
          visibility: new Set([Visibility.INTERNAL]),
        },
        ...(totalNamingStandardViolations > 0
          ? [
              {
                label: localization.datasetDetail.namingStandardViolations,
                value: (
                  <Badge
                    count={totalNamingStandardViolations}
                    data-color='warning'
                    data-size='sm'
                    className={styles.violationBadge}
                    aria-label={`${totalNamingStandardViolations} total ${localization.datasetDetail.namingStandardViolations}`}
                  />
                ),
              },
            ]
          : []),
        { label: localization.datasetDetail.id, value: <CopyTag text={dataset.id ?? 'undefined'} copyType='id' /> },
      ]}
    />
  );
}

export default function DatasetDetail({
  dataset,
  dataFilesShared,
  dataFilesProduct,
  datasetVariables = [],
}: Readonly<{
  dataset: DatasetDTO;
  dataFilesShared: Array<DaplaDataFileDTO>;
  dataFilesProduct: Array<DaplaDataFileDTO>;
  datasetVariables?: DatasetVariableDTO[];
}>) {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated && dataset.has_naming_standard_violations === true) {
    notFound();
  }

  const dataFiles = isAuthenticated
    ? [...dataFilesShared, ...dataFilesProduct]
    : dataFilesShared.filter((df) => !df.naming_standard_violations?.length);

  const totalNamingStandardViolations = dataFiles.reduce(
    (total, dataFile) => total + (dataFile.naming_standard_violations?.length ?? 0),
    0,
  );
  const { isValid, allItems, years, slots } = useTimelineData(dataFiles);
  const canFilterVariables = isAuthenticated && datasetVariables.length > 0;
  const datasetId = dataset.id ?? '';
  const timelinePeriods = useMemo<TimelinePeriodSlot[]>(
    () => years.flatMap((year) => (slots[year] ?? []).map((slot) => ({ ...slot, year }))),
    [slots, years],
  );
  const [{ q, periodFrom, periodTo }, setQueryState] = useQueryStates({
    q: parseAsString.withDefault(''),
    periodFrom: parseAsString,
    periodTo: parseAsString,
  });
  // Persist boundaries rather than indexes so links survive changes to available periods.
  const filters = getDatasetFilterState(timelinePeriods, { q, periodFrom, periodTo }, canFilterVariables, isValid);
  const updateFilters = (updates: Partial<FilterState>) => {
    const queryUpdate: Partial<{ q: string | null; periodFrom: string | null; periodTo: string | null }> = {};
    if (updates.search !== undefined) queryUpdate.q = updates.search || null;
    if (updates.period !== undefined) {
      queryUpdate.periodFrom = updates.period ? (timelinePeriods[updates.period[0]]?.start ?? null) : null;
      queryUpdate.periodTo = updates.period ? (timelinePeriods[updates.period[1]]?.end ?? null) : null;
    }
    setQueryState(queryUpdate).catch((error) => {
      clientLogger.error('Failed to update query state', error);
    });
  };
  const { range: selectedPeriodRange } = getSelectedPeriods(timelinePeriods, filters.period);
  const toggleTimelinePeriod = (slot: Pick<Slot, 'start' | 'end'>) => {
    const period = getPeriodIndexes(timelinePeriods, slot.start, slot.end);
    if (!period) return;

    const isAlreadySelected = filters.period?.[0] === period[0] && filters.period[1] === period[1];
    updateFilters({ period: isAlreadySelected ? null : period });
  };
  const language = localization.getLanguage();
  const normalizedVariableNameFilter = filters.search.trim().toLocaleLowerCase(language);
  const matchingDatasetVariables = useMemo(
    () =>
      datasetVariables
        .filter((variable) => variable.short_name.toLocaleLowerCase(language).includes(normalizedVariableNameFilter))
        .toSorted((a, b) => a.short_name.localeCompare(b.short_name, language)),
    [datasetVariables, language, normalizedVariableNameFilter],
  );

  const matchingFilePaths = useDebouncedLoad(
    isValid && normalizedVariableNameFilter ? JSON.stringify([datasetId, normalizedVariableNameFilter]) : null,
    async () =>
      new Set(
        await listDatasetVariableDataFilePaths(
          datasetId,
          matchingDatasetVariables.map((variable) => variable.id),
        ),
      ),
    new Set<string>(),
  );
  const variableIdsInPeriod = useDebouncedLoad(
    canFilterVariables && selectedPeriodRange
      ? `${datasetId}:${selectedPeriodRange.start}:${selectedPeriodRange.end}`
      : null,
    async () =>
      new Set(
        await listDatasetVariableIdsInPeriod(
          datasetId,
          selectedPeriodRange?.start ?? '',
          selectedPeriodRange?.end ?? '',
        ),
      ),
    null,
  );
  const periodFilteredDatasetVariables = useMemo(() => {
    const ids = variableIdsInPeriod.value;
    return ids ? matchingDatasetVariables.filter((variable) => ids.has(variable.id)) : matchingDatasetVariables;
  }, [matchingDatasetVariables, variableIdsInPeriod.value]);

  const filteredTimelineItems = useMemo(() => {
    if (!normalizedVariableNameFilter) return allItems;
    const filePaths = matchingFilePaths.value;
    return filePaths ? allItems.filter((item) => filePaths.has(item.file_path)) : allItems;
  }, [allItems, matchingFilePaths.value, normalizedVariableNameFilter]);

  const timelineContent = isValid ? (
    <DataCoverageTimeline
      showHeading={!canFilterVariables}
      isValid={isValid}
      allItems={filteredTimelineItems}
      unfilteredItems={allItems}
      years={years}
      slots={slots}
      selectedPeriodRange={selectedPeriodRange}
      onSelectPeriod={canFilterVariables ? toggleTimelinePeriod : undefined}
    />
  ) : (
    <>
      <Heading
        level={2}
        className={`${styles.detailsHeading} secondaryHeading`}
        data-size='md'
        id='tableHeading-dataFiles'
      >
        {localization.datasetDetail.dataFiles}
      </Heading>
      <div className={styles.dataFilesList}>
        {dataFiles
          .toSorted((a, b) =>
            sortDateStringsDescending(
              a.contains_data_from?.toISOString().split('T')[0],
              b.contains_data_from?.toISOString().split('T')[0],
            ),
          )
          .map((dataFile) => (
            <DataFileSearchHit dataFile={dataFile} key={dataFile.file_path} />
          ))}
      </div>
    </>
  );
  const variableContent = canFilterVariables ? (
    <DatasetVariableList
      variables={periodFilteredDatasetVariables}
      isLoading={matchingFilePaths.isLoading || variableIdsInPeriod.isLoading}
    />
  ) : null;

  return (
    <div className={`${styles.detailsPage} container`}>
      <DataportalBreadcrumbs
        items={[
          { text: localization.tabs.dataProducts, href: tabsData.DataProducts.route },
          {
            text: dataset.product_short_name ?? '',
            href: tabsData.DataProducts.route + '/' + dataset.product_short_name,
          },
        ]}
        currentText={dataset.short_description ?? ''}
      />
      <main className={styles.mainContent}>
        <Heading className={`${styles.detailsHeading} primaryHeading`} data-size='xl' level={1}>
          {dataset.short_description}
        </Heading>
        <DatasetAbout
          dataset={dataset}
          isAuthenticated={isAuthenticated}
          totalNamingStandardViolations={totalNamingStandardViolations}
        />
        <Card
          className={canFilterVariables ? workspaceStyles.workspaceCard : styles.tableContainer}
          data-testid='dataset-periods-and-variables'
          aria-busy={matchingFilePaths.isLoading || variableIdsInPeriod.isLoading}
        >
          <DatasetFilters
            filters={filters}
            timelinePeriods={timelinePeriods}
            onChange={updateFilters}
            content={{
              timeline: timelineContent,
              variables: variableContent,
              showFilters: canFilterVariables,
            }}
          />
        </Card>
      </main>
    </div>
  );
}
