'use client';

import { Badge, Card, Heading, Tag } from '@digdir/designsystemet-react';
import { notFound } from 'next/navigation';
import { useMemo, useState } from 'react';
import { tabsData } from '@/app/(services)/tabs';
import { useAuthContext } from '@/app/authContext';
import { useTimelineData } from '@/components/data-coverage-timeline';
import DataCoverageTimeline from '@/components/data-coverage-timeline/dataCoverageTimeline';
import { DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { DetailsList } from '@/components/details-list';
import { ExternalLink } from '@/components/link-components/externalLink';
import { CopyTag } from '@/components/tag-components/copy-tag';
import { DaplaDataFileDTO, DatasetDTO, DatasetVariableDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';
import { Visibility } from '@/types/item';
import { getDaplaCtrlUrl } from '@/utils/config';
import { convertAssessment, convertDataSetState } from '@/utils/functions';
import { sortDateStringsDescending } from '@/utils/sort';
import { DataFileSearchHit } from '../../components/DataFileSearchHit';
import { listDatasetVariableDataFilePaths, listDatasetVariableIdsInPeriod } from './actions';
import DatasetVariableList from './DatasetVariableList';
import styles from './dataset-page.module.css';
import { DatasetFilters, type FilterState, getSelectedPeriods, type TimelinePeriodSlot } from './datasetFilters';
import { useDebouncedLoad } from './useDebouncedLoad';

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
  const { isValid, periodType, allItems, items, years, slots } = useTimelineData(dataFiles);
  const datasetId = dataset.id ?? '';
  const timelinePeriods = useMemo<TimelinePeriodSlot[]>(
    () => years.flatMap((year) => (slots[year] ?? []).map((slot) => ({ ...slot, year }))),
    [slots, years],
  );
  const [filters, setFilters] = useState<FilterState>({ search: '', period: null });
  const updateFilters = (updates: Partial<FilterState>) => setFilters((current) => ({ ...current, ...updates }));
  const { range: selectedPeriodRange } = getSelectedPeriods(timelinePeriods, filters.period);
  const normalizedVariableNameFilter = filters.search.trim().toLocaleLowerCase('nb');
  const filteredDatasetVariables = useMemo(
    () =>
      datasetVariables
        .filter((variable) => variable.short_name.toLocaleLowerCase('nb').includes(normalizedVariableNameFilter))
        .toSorted((a, b) => a.short_name.localeCompare(b.short_name, 'nb')),
    [datasetVariables, normalizedVariableNameFilter],
  );

  const nameMatchedFilePaths = useDebouncedLoad(
    isValid && normalizedVariableNameFilter ? `${datasetId}:${normalizedVariableNameFilter}` : null,
    async () =>
      new Set(
        await listDatasetVariableDataFilePaths(
          datasetId,
          filteredDatasetVariables.map((v) => v.id),
        ),
      ),
    new Set<string>(),
  );
  const variableIdsInPeriod = useDebouncedLoad(
    selectedPeriodRange ? `${datasetId}:${selectedPeriodRange.start}:${selectedPeriodRange.end}` : null,
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
    return ids ? filteredDatasetVariables.filter((variable) => ids.has(variable.id)) : filteredDatasetVariables;
  }, [filteredDatasetVariables, variableIdsInPeriod.value]);

  const filteredTimelineItems = useMemo(() => {
    if (!normalizedVariableNameFilter) return allItems;
    const filePaths = nameMatchedFilePaths.value;
    return filePaths ? allItems.filter((item) => filePaths.has(item.file_path)) : [];
  }, [allItems, nameMatchedFilePaths.value, normalizedVariableNameFilter]);

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
            <DatasetFilters filters={filters} timelinePeriods={timelinePeriods} onChange={updateFilters} />
          ) : null}
          {isValid ? (
            <DataCoverageTimeline
              isValid={isValid}
              periodType={periodType}
              allItems={filteredTimelineItems}
              items={items}
              years={years}
              slots={slots}
              selectedPeriodRange={selectedPeriodRange}
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
            <DatasetVariableList variables={periodFilteredDatasetVariables} />
          ) : null}
        </Card>
      </main>
    </div>
  );
}
