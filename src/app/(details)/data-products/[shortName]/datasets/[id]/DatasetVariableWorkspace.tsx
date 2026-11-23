'use client';

import { Card, Heading } from '@digdir/designsystemet-react';
import { parseAsString, useQueryStates } from 'nuqs';
import { useMemo } from 'react';
import { useAuthContext } from '@/app/authContext';
import { useTimelineData } from '@/components/data-coverage-timeline';
import DataCoverageTimeline from '@/components/data-coverage-timeline/dataCoverageTimeline';
import type { Slot } from '@/components/data-coverage-timeline/types';
import type { DaplaDataFileDTO, DatasetVariableDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';
import { clientLogger } from '@/libs/logger/client-logger';
import { sortDateStringsDescending } from '@/utils/sort';
import { DataFileSearchHit } from '../../components/DataFileSearchHit';
import { listDatasetVariableDataFilePaths, listDatasetVariableIdsInPeriod } from './actions';
import DatasetVariableList from './DatasetVariableList';
import styles from './dataset-page.module.css';
import workspaceStyles from './dataset-workspace.module.css';
import { DatasetFilters, type FilterState, getSelectedPeriods, type TimelinePeriodSlot } from './datasetFilters';
import type { EmptyStateProps } from './EmptyState';
import { getPublicDataFiles } from './getPublicDataFiles';
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

function getEmptyState(query: string, period: string, hasSelectedPeriod: boolean): EmptyStateProps {
  if (query && hasSelectedPeriod) {
    return { reason: 'no-match-for-combination', filters: [`«${query}»`, period] };
  }
  if (query) return { reason: 'no-name-match', query };
  return { reason: 'no-data-for-period', period };
}

export default function DatasetVariableWorkspace({
  datasetId,
  dataFilesShared,
  dataFilesProduct,
  datasetVariables,
}: Readonly<{
  datasetId: string;
  dataFilesShared: DaplaDataFileDTO[];
  dataFilesProduct: DaplaDataFileDTO[];
  datasetVariables: DatasetVariableDTO[];
}>) {
  const { isAuthenticated } = useAuthContext();
  const dataFiles = useMemo(
    () => (isAuthenticated ? [...dataFilesShared, ...dataFilesProduct] : getPublicDataFiles(dataFilesShared)),
    [dataFilesShared, dataFilesProduct, isAuthenticated],
  );
  const { isValid, allItems, years, slots } = useTimelineData(dataFiles);
  const canFilterVariables = isAuthenticated && datasetVariables.length > 0;
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
  const filters: FilterState = {
    search: canFilterVariables ? q : '',
    period: canFilterVariables && isValid ? getPeriodIndexes(timelinePeriods, periodFrom, periodTo) : null,
  };
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
  const { range: selectedPeriodRange, label: periodLabel } = getSelectedPeriods(timelinePeriods, filters.period);
  const query = filters.search.trim();
  const emptyState = getEmptyState(query, periodLabel, selectedPeriodRange !== undefined);
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
  const isLoading = matchingFilePaths.isLoading || variableIdsInPeriod.isLoading;
  const timeline = isValid ? (
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

  return (
    <Card
      className={canFilterVariables ? workspaceStyles.workspaceCard : styles.tableContainer}
      data-testid='dataset-periods-and-variables'
      aria-busy={isLoading}
    >
      <DatasetFilters
        filters={filters}
        timelinePeriods={timelinePeriods}
        onChange={updateFilters}
        content={{ timeline, showFilters: canFilterVariables }}
        renderVariables={(onReset) =>
          canFilterVariables ? (
            <DatasetVariableList
              variables={periodFilteredDatasetVariables}
              isLoading={isLoading}
              emptyState={{ ...emptyState, onReset: query || selectedPeriodRange ? onReset : undefined }}
            />
          ) : null
        }
      />
    </Card>
  );
}
