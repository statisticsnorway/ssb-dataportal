'use client';

import {
  Badge,
  Card,
  Chip,
  Details,
  DetailsContent,
  DetailsSummary,
  Heading,
  Search,
  Tag,
} from '@digdir/designsystemet-react';
import { notFound } from 'next/navigation';
import { useMemo, useState } from 'react';
import { tabsData } from '@/app/(services)/tabs';
import { useAuthContext } from '@/app/authContext';
import { useTimelineData } from '@/components/data-coverage-timeline';
import DataCoverageTimeline from '@/components/data-coverage-timeline/dataCoverageTimeline';
import type { Slot } from '@/components/data-coverage-timeline/types';
import { DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { DetailsList } from '@/components/details-list';
import { FilterSection } from '@/components/filters';
import { ExternalLink } from '@/components/link-components/externalLink';
import { Slider } from '@/components/slider';
import { CopyTag } from '@/components/tag-components/copy-tag';
import { DaplaDataFileDTO, DatasetDTO, DatasetVariableDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';
import { Visibility } from '@/types/item';
import { getDaplaCtrlUrl } from '@/utils/config';
import { convertAssessment, convertDataSetState } from '@/utils/functions';
import { sortDateStringsDescending } from '@/utils/sort';
import { DataFileSearchHit } from '../../components/DataFileSearchHit';
import { listDatasetVariableDataFilePaths, listDatasetVariableIdsInPeriod } from './actions';
import DatasetVariableCard from './DatasetVariableCard';
import styles from './dataset-page.module.css';
import { useDebouncedLoad } from './useDebouncedLoad';

type TimelinePeriodSlot = Slot & { year: number };
type FilterState = {
  search: string;
  period: readonly [number, number] | null;
};

const formatTimelinePeriod = (period: TimelinePeriodSlot | undefined, capitalize = false) => {
  if (!period) return '';
  const label = capitalize ? `${period.label.charAt(0).toLocaleUpperCase()}${period.label.slice(1)}` : period.label;
  return `${label} ${period.year}`;
};

const formatTimelineRange = (periods: TimelinePeriodSlot[]) => {
  const firstPeriod = periods[0];
  const lastPeriod = periods.at(-1);
  if (!firstPeriod || !lastPeriod) return '';
  if (firstPeriod.start === lastPeriod.start && firstPeriod.end === lastPeriod.end) {
    return formatTimelinePeriod(firstPeriod, true);
  }
  return `${formatTimelinePeriod(firstPeriod, true)} – ${formatTimelinePeriod(lastPeriod)}`;
};

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

  let dataFiles = isAuthenticated ? [...dataFilesShared, ...dataFilesProduct] : dataFilesShared;

  if (!isAuthenticated && dataset.has_naming_standard_violations === true) {
    notFound();
  }

  if (!isAuthenticated) {
    dataFiles = dataFiles.filter(
      (df) => df.naming_standard_violations === undefined || df.naming_standard_violations.length === 0,
    );
  }

  const totalNamingStandardViolations = dataFiles.reduce(
    (total, dataFile) => total + (dataFile.naming_standard_violations?.length ?? 0),
    0,
  );
  const { isValid, periodType, allItems, items, years, slots } = useTimelineData(dataFiles);
  const datasetId = dataset.id ?? '';
  const timelinePeriods = useMemo<TimelinePeriodSlot[]>(
    () => years.flatMap((year) => (slots[year] ?? []).map((slot) => ({ ...slot, year }))),
    [slots, years],
  );
  const lastPeriodIndex = Math.max(0, timelinePeriods.length - 1);
  const [filters, setFilters] = useState<FilterState>({ search: '', period: null });
  const updateFilters = (updates: Partial<FilterState>) => setFilters((current) => ({ ...current, ...updates }));
  const savedPeriodRange = filters.period;
  const periodStartIndex = savedPeriodRange ? Math.max(0, Math.min(savedPeriodRange[0], lastPeriodIndex)) : 0;
  const periodEndIndex = savedPeriodRange
    ? Math.max(periodStartIndex, Math.min(savedPeriodRange[1], lastPeriodIndex))
    : lastPeriodIndex;
  const selectedPeriods = timelinePeriods.slice(periodStartIndex, periodEndIndex + 1);
  const selectedPeriodStart = selectedPeriods[0]?.start;
  const selectedPeriodEnd = selectedPeriods.at(-1)?.end;
  const isPeriodRangeFiltered =
    timelinePeriods.length > 0 && (periodStartIndex > 0 || periodEndIndex < lastPeriodIndex);
  const periodRangeLabel = formatTimelineRange(selectedPeriods);
  const trimmedSearch = filters.search.trim();
  const normalizedVariableNameFilter = trimmedSearch.toLocaleLowerCase('nb');
  const hasActiveFilters = trimmedSearch.length > 0 || isPeriodRangeFiltered;
  const filteredDatasetVariables = useMemo(
    () =>
      datasetVariables
        .filter((variable) => variable.short_name.toLocaleLowerCase('nb').includes(normalizedVariableNameFilter))
        .toSorted((a, b) => a.short_name.localeCompare(b.short_name, 'nb')),
    [datasetVariables, normalizedVariableNameFilter],
  );
  const filteredVariableIds = useMemo(
    () => filteredDatasetVariables.map((variable) => variable.id),
    [filteredDatasetVariables],
  );

  const nameMatchedFilePaths = useDebouncedLoad(
    isValid && normalizedVariableNameFilter ? `${datasetId}:${filteredVariableIds.join(',')}` : null,
    async () =>
      new Set(
        filteredVariableIds.length > 0 ? await listDatasetVariableDataFilePaths(datasetId, filteredVariableIds) : [],
      ),
    new Set<string>(),
  );
  const variableIdsInPeriod = useDebouncedLoad(
    isValid && isPeriodRangeFiltered && selectedPeriodStart && selectedPeriodEnd
      ? `${datasetId}:${selectedPeriodStart}:${selectedPeriodEnd}`
      : null,
    async () =>
      new Set(await listDatasetVariableIdsInPeriod(datasetId, selectedPeriodStart ?? '', selectedPeriodEnd ?? '')),
    null,
  );
  const periodFilteredDatasetVariables = useMemo(() => {
    const ids = variableIdsInPeriod.value;
    return ids ? filteredDatasetVariables.filter((variable) => ids.has(variable.id)) : filteredDatasetVariables;
  }, [filteredDatasetVariables, variableIdsInPeriod.value]);

  const filteredTimelineItems = useMemo(() => {
    if (!normalizedVariableNameFilter) return allItems;
    const filePaths = nameMatchedFilePaths.value;
    return filePaths ? allItems.filter((item) => filePaths.has(item.file_path)) : [];
  }, [allItems, nameMatchedFilePaths.value, normalizedVariableNameFilter]);

  const updatePeriodRange = (period: readonly [number, number]) => {
    updateFilters({ period: period[0] === 0 && period[1] === lastPeriodIndex ? null : period });
  };

  const resetFilters = () => updateFilters({ search: '', period: null });

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
        <DetailsList
          title={localization.datasetDetail.aboutDataset}
          allowedVisibility={isAuthenticated ? Visibility.INTERNAL : Visibility.EXTERNAL}
          content={[
            { label: localization.datasetDetail.dataProduct, value: dataset.product_short_name },
            { label: localization.datasetDetail.bucket, value: dataset.storage_location_name },
            {
              label: localization.datasetDetail.datasetState,
              value: dataset.dataset_state && (
                <Tag data-color='magic'>{convertDataSetState(dataset.dataset_state)}</Tag>
              ),
            },
            {
              label: localization.datasetDetail.assessment,
              value: dataset.assessment && <Tag data-color='magic'> {convertAssessment(dataset.assessment)}</Tag>,
            },
            {
              label: localization.datasetDetail.responsible,
              value: (
                <ExternalLink
                  linkText={dataset.owner ?? 'undefined'}
                  href={`${getDaplaCtrlUrl()}/team/${dataset.owner}`}
                />
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
        <Card
          className={styles.tableContainer}
          data-testid='dataset-periods-and-variables'
          aria-busy={nameMatchedFilePaths.isLoading || variableIdsInPeriod.isLoading}
        >
          {isAuthenticated && datasetVariables.length > 0 ? (
            <Details className={styles.filterDetails}>
              <DetailsSummary>{localization.datasetDetail.filter}</DetailsSummary>
              <DetailsContent className={styles.filterDetailsContent}>
                <div className={styles.filterPanel}>
                  <div className={styles.filterSections}>
                    <FilterSection title={localization.search.label} className={styles.filterSection}>
                      <Search>
                        <Search.Input
                          id={localization.search.textFilter.inputId}
                          aria-label={localization.search.textFilter.label}
                          value={filters.search}
                          onChange={(event) => updateFilters({ search: event.target.value })}
                        />
                        <Search.Clear onClick={() => updateFilters({ search: '' })} />
                      </Search>
                    </FilterSection>
                    {isValid && timelinePeriods.length > 0 ? (
                      <FilterSection title={localization.datasetDetail.period} className={styles.filterSection}>
                        <Slider<readonly [number, number]>
                          aria-label={localization.datasetDetail.periodRange}
                          valueLabel={periodRangeLabel}
                          rangeLabels={[localization.datasetDetail.periodFrom, localization.datasetDetail.periodTo]}
                          value={[periodStartIndex, periodEndIndex]}
                          min={0}
                          max={lastPeriodIndex}
                          step={1}
                          disabled={lastPeriodIndex === 0}
                          formatValue={(index) => formatTimelinePeriod(timelinePeriods[index])}
                          onChange={updatePeriodRange}
                          onChangeEnd={updatePeriodRange}
                        />
                      </FilterSection>
                    ) : null}
                  </div>
                  {hasActiveFilters ? (
                    <div className={styles.activeFiltersRow}>
                      <Chip.Button className={styles.resetFiltersButton} onClick={resetFilters}>
                        {localization.datasetDetail.resetFilters}
                      </Chip.Button>
                      <ul
                        className={styles.activeFilterChips}
                        aria-label={localization.filterTag.listLabel}
                        aria-live='polite'
                      >
                        {trimmedSearch ? (
                          <li>
                            <Chip.Removable
                              aria-label={`${localization.filterTag.remove} ${localization.search.label}: ${trimmedSearch}`}
                              onClick={() => updateFilters({ search: '' })}
                            >
                              {`${localization.search.label}: «${trimmedSearch}»`}
                            </Chip.Removable>
                          </li>
                        ) : null}
                        {isPeriodRangeFiltered ? (
                          <li>
                            <Chip.Removable
                              aria-label={`${localization.filterTag.remove} ${localization.datasetDetail.period}: ${periodRangeLabel}`}
                              onClick={() => updateFilters({ period: null })}
                            >
                              {periodRangeLabel}
                            </Chip.Removable>
                          </li>
                        ) : null}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </DetailsContent>
            </Details>
          ) : null}
          {isValid ? (
            <DataCoverageTimeline
              isValid={isValid}
              periodType={periodType}
              allItems={filteredTimelineItems}
              items={items}
              years={years}
              slots={slots}
              selectedPeriodRange={
                isPeriodRangeFiltered && selectedPeriodStart && selectedPeriodEnd
                  ? { start: selectedPeriodStart, end: selectedPeriodEnd }
                  : undefined
              }
            />
          ) : (
            // Fallback when calendar can't be rendered: List data files
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
          )}
          {isAuthenticated && datasetVariables.length > 0 ? (
            <section className={styles.variablesSection}>
              <ul className={styles.variablesList}>
                {periodFilteredDatasetVariables.length === 0 ? (
                  <li className={styles.variableNoHits} role='status'>
                    {localization.search.noHits}
                  </li>
                ) : (
                  periodFilteredDatasetVariables.map((variable) => (
                    <DatasetVariableCard key={variable.id} variable={variable} />
                  ))
                )}
              </ul>
            </section>
          ) : null}
        </Card>
      </main>
    </div>
  );
}
