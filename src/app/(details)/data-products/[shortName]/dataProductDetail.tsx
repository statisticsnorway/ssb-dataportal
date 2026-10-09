'use client';

import { Alert, Heading } from '@digdir/designsystemet-react';
import { notFound } from 'next/navigation';
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';
import { useMemo, useState } from 'react';
import { tabsData } from '@/app/(services)/tabs';
import { useAuthContext } from '@/app/authContext';
import { DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { CheckboxFilter, FiltersPanel, FilterTagsSection } from '@/components/filters';
import { TextFilter } from '@/components/filters/text-filter';
import { SortFields } from '@/components/sort-fields';
import { Assessment, DataProductDTO, DatasetDTO, StorageCategory } from '@/libs/data-access/datadoc/models';
import { localization } from '@/libs/language';
import { clientLogger } from '@/libs/logger/client-logger';
import { FilterItem } from '@/types/filters';
import { scrollToFilterTags } from '@/utils/scrollToFilterTags';
import { DatasetSearchHit } from './components/DatasetSearchHit';
import styles from './page.module.css';

interface DataProductDetailContentProps {
  dataProduct: DataProductDTO;
  datasetsShared: DatasetDTO[];
  datasetsProduct?: DatasetDTO[];
  namingStandardViolationsByDatasetId: Record<string, number>;
}

const assessmentFilterValues = [Assessment.PROTECTED, Assessment.OPEN, Assessment.SENSITIVE];
const storageCategoryFilterValues = [StorageCategory.PRODUCT, StorageCategory.SHARED];

const sortOptionsAuthenticated = ['titleAsc', 'titleDesc', 'violationsDesc'] as const;
const sortOptionsUnauthenticated = ['titleAsc', 'titleDesc'] as const;

type DatasetSortOption = (typeof sortOptionsAuthenticated)[number];

/**
 * The DataProductDetail component is responsible for rendering the details of a data product, including its datasets and associated filters.
 * @param props The props for the DataProductDetail component, including the data product and its datasets.
 * @returns The rendered DataProductDetail component.
 */
export default function DataProductDetail(props: Readonly<DataProductDetailContentProps>) {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated && props.dataProduct.contains_valid_datasets === false) {
    notFound();
  }

  return <DataProductDetailContent {...props} isAuthenticated={isAuthenticated} />;
}

function DataProductDetailContent({
  isAuthenticated,
  dataProduct,
  datasetsShared,
  datasetsProduct,
  namingStandardViolationsByDatasetId,
}: Readonly<DataProductDetailContentProps & { isAuthenticated: boolean }>) {
  const visibleDatasets = useMemo(
    () =>
      isAuthenticated
        ? [...datasetsShared, ...(datasetsProduct ?? [])]
        : datasetsShared.filter((dataset) => !dataset.has_naming_standard_violations),
    [isAuthenticated, datasetsProduct, datasetsShared],
  );

  const assessmentLabelByValue: Record<string, string> = {
    [Assessment.PROTECTED]: localization.products.assessment.protected,
    [Assessment.OPEN]: localization.products.assessment.open,
    [Assessment.SENSITIVE]: localization.products.assessment.sensitive,
  };

  const storageCategoryLabelByValue: Record<string, string> = {
    [StorageCategory.SHARED]: localization.products.storageCategory.shared,
    [StorageCategory.PRODUCT]: localization.products.storageCategory.product,
  };
  
  const [{ assessments, storageCategories, q: textFilterValue }, setQueryState] = useQueryStates({
    q: parseAsString.withDefault(''),
    assessments: parseAsArrayOf(parseAsString).withDefault([]),
    storageCategories: parseAsArrayOf(parseAsString).withDefault([]),
  });

  const [sortBy, setSortBy] = useState<DatasetSortOption>('titleAsc');

  const updateQuery = (update: Parameters<typeof setQueryState>[0]) =>
    setQueryState(update).catch((error) => {
      clientLogger.error('Failed to update query state', error);
    });

  const handleTextFilterChange = (value: string) => {
    updateQuery({ q: value || null });
  };
  const toggleAssessment = (filter: FilterItem) => {
    updateQuery({
      assessments: assessments.includes(filter.value)
        ? assessments.filter((value) => value !== filter.value)
        : [...assessments, filter.value],
    });
  };

  const toggleStorageCategory = (filter: FilterItem) => {
    updateQuery({
      storageCategories: storageCategories.includes(filter.value)
        ? storageCategories.filter((value) => value !== filter.value)
        : [...storageCategories, filter.value],
    });
  };

  const countByAssessment = (datasets: DatasetDTO[]) =>
    datasets.reduce<Record<string, number>>((counts, dataset) => {
      const assessment = dataset.assessment;
      if (typeof assessment === 'string') {
        counts[assessment] = (counts[assessment] ?? 0) + 1;
      }
      return counts;
    }, {});

  const countByStorageCategory = (datasets: DatasetDTO[]) =>
    datasets.reduce<Record<string, number>>((counts, dataset) => {
      const storageCategory = dataset.storage_category;
      if (typeof storageCategory === 'string') {
        counts[storageCategory] = (counts[storageCategory] ?? 0) + 1;
      }
      return counts;
    }, {});

  const textFilteredDatasets = useMemo(() => {
    const normalizedQuery = textFilterValue.trim().toLocaleLowerCase('nb');

    if (!normalizedQuery) {
      return visibleDatasets;
    }

    return visibleDatasets.filter(
      (dataset) =>
        dataset.short_description?.toLocaleLowerCase('nb').includes(normalizedQuery) ||
        dataset.id?.toLocaleLowerCase('nb').includes(normalizedQuery),
    );
  }, [visibleDatasets, textFilterValue]);

  const assessmentCounts = useMemo(() => countByAssessment(textFilteredDatasets), [textFilteredDatasets]);

  const storageCategoryCounts = useMemo(() => countByStorageCategory(textFilteredDatasets), [textFilteredDatasets]);

  const assessmentFilters = useMemo<FilterItem[]>(
    () =>
      assessmentFilterValues.map((value) => ({
        value,
        label: assessmentLabelByValue[value] ?? value,
        count: assessmentCounts[value] ?? 0,
      })),
    [assessmentCounts],
  );

  const storageCategoryFilters = useMemo<FilterItem[]>(
    () =>
      storageCategoryFilterValues.map((value) => ({
        value,
        label: storageCategoryLabelByValue[value] ?? value,
        count: storageCategoryCounts[value] ?? 0,
      })),
    [storageCategoryCounts],
  );
  const selectedAssessmentFilters = useMemo<FilterItem[]>(
    () =>
      assessments.map((value) => ({
        value,
        label: assessmentLabelByValue[value] ?? value,
      })),
    [assessments],
  );

  const selectedStorageCategoryFilters = useMemo<FilterItem[]>(
    () =>
      storageCategories.map((value) => ({
        value,
        label: storageCategoryLabelByValue[value] ?? value,
      })),
    [storageCategories],
  );

  const filterTags = useMemo(
    () => [...selectedAssessmentFilters, ...selectedStorageCategoryFilters],
    [selectedAssessmentFilters, selectedStorageCategoryFilters],
  );

  const removeFilter = (filter: FilterItem) => {
    updateQuery({
      assessments: assessments.filter((value) => value !== filter.value),
      storageCategories: storageCategories.filter((value) => value !== filter.value),
    });
    scrollToFilterTags();
  };

  const clearAll = async () => {
    await setQueryState({
      q: null,
      assessments: null,
      storageCategories: null,
    });
    scrollToFilterTags();
  };
  const filteredDatasets = useMemo(
    () =>
      textFilteredDatasets.filter((dataset) => {
        const matchesAssessment =
          assessments.length === 0 ||
          (typeof dataset.assessment === 'string' && assessments.includes(dataset.assessment));

        const matchesStorageCategory =
          storageCategories.length === 0 ||
          (typeof dataset.storage_category === 'string' && storageCategories.includes(dataset.storage_category));

        return matchesAssessment && matchesStorageCategory;
      }),
    [textFilteredDatasets, assessments, storageCategories],
  );

  const sortedDatasets = useMemo(() => {
    return [...filteredDatasets].sort((a, b) => {
      const titleA = a.short_description ?? a.id ?? '';
      const titleB = b.short_description ?? b.id ?? '';

      if (sortBy === 'titleDesc') {
        return titleB.localeCompare(titleA, 'nb');
      }

      if (sortBy === 'violationsDesc') {
        const violationsA = a.id ? (namingStandardViolationsByDatasetId[a.id] ?? 0) : 0;
        const violationsB = b.id ? (namingStandardViolationsByDatasetId[b.id] ?? 0) : 0;
        if (violationsA !== violationsB) {
          return violationsB - violationsA;
        }
      }

      return titleA.localeCompare(titleB, 'nb');
    });
  }, [filteredDatasets, namingStandardViolationsByDatasetId, sortBy]);

  const hasNamingStandardViolations = visibleDatasets.some(
    (dataset) => dataset.id && (namingStandardViolationsByDatasetId[dataset.id] ?? 0) > 0,
  );

  const availableSortOptions =
    isAuthenticated && hasNamingStandardViolations ? sortOptionsAuthenticated : sortOptionsUnauthenticated;

  return (
    <div className={`${styles.detailsPage} container`}>
      <DataportalBreadcrumbs
        items={[{ text: localization.tabs.dataProducts, href: tabsData.DataProducts.route }]}
        currentText={dataProduct.title ?? dataProduct.product_short_name ?? undefined}
      />

      <main className={styles.mainContent}>
        <Heading className={`${styles.detailsHeading} primaryHeading`} data-size='xl' level={1}>
          {dataProduct.title ?? dataProduct.product_short_name}
        </Heading>
        <div className={styles.searchHitsContainerWrapper}>
          <aside className={styles.filterSection} aria-label={localization.dataProductDetail.dataProductFilters}>
            <FiltersPanel heading={localization.search.filter.label}>
              <TextFilter
                label={localization.search.textFilter.label}
                searchTerm={textFilterValue}
                setSearchTerm={handleTextFilterChange}
              />
              <CheckboxFilter
                filterHeading={localization.products.assessment.filterLabel}
                filters={assessmentFilters}
                selectedItems={selectedAssessmentFilters}
                onFilterChange={toggleAssessment}
              />
              {isAuthenticated && (
                <CheckboxFilter
                  filterHeading={localization.products.storageCategory.filterLabel}
                  filters={storageCategoryFilters}
                  selectedItems={selectedStorageCategoryFilters}
                  onFilterChange={toggleStorageCategory}
                />
              )}
            </FiltersPanel>
          </aside>
          <section className={styles.mainSection}>
            <div className={styles.hitsAndSort}>
              <div className={styles.filterTags}>
                <Heading level={2} className={`${styles.sectionHeading} secondaryHeading`}>
                  {localization.dataProductDetail.dataset}
                </Heading>
                <FilterTagsSection
                  tags={filterTags}
                  onRemoveTag={removeFilter}
                  onClearAll={clearAll}
                  searchTerm={textFilterValue}
                  onClearSearch={() => {
                    updateQuery({ q: null });
                    scrollToFilterTags();
                  }}
                />
              </div>
              <div className={styles.hitsSortGroup}>
                <p className={styles.numHits}>
                  {sortedDatasets.length === 0
                    ? localization.search.noHits
                    : `${sortedDatasets.length} ${localization.search.hits}`}
                </p>
                <SortFields
                  sortOptions={availableSortOptions}
                  sortValue={sortBy}
                  sortLabels={{
                    violationsDesc: localization.dataProductDetail.sortByMostNamingStandardViolations,
                  }}
                  onSortChange={(value) => {
                    setSortBy(value as DatasetSortOption);
                  }}
                />
              </div>
            </div>
            <div className={styles.datasetList}>
              {sortedDatasets.length > 0 ? (
                sortedDatasets.map((d) => (
                  <DatasetSearchHit
                    key={d.id ?? `${d.product_short_name}-${d.short_description}`}
                    dataset={d}
                    namingStandardViolationsCount={d.id ? (namingStandardViolationsByDatasetId[d.id] ?? 0) : 0}
                  />
                ))
              ) : (
                <Alert data-color={'info'} role='status'>
                  {localization.dataProductDetail.noDatasetAvailable}
                </Alert>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
