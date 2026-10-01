'use client';

import { Heading } from '@digdir/designsystemet-react';
import { notFound } from 'next/navigation';
import { useMemo, useState } from 'react';
import { tabsData } from '@/app/(services)/tabs';
import { useAuthContext } from '@/app/authContext';
import { DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { CheckboxFilter, FiltersPanel } from '@/components/filters';
import { SortFields } from '@/components/sort-fields';
import { DataProductDTO, DatasetDTO } from '@/libs/data-access/datadoc/models';
import { localization } from '@/libs/language';
import { FilterItem } from '@/types/filters';
import { DatasetSearchHit } from './components/DatasetSearchHit';
import styles from './page.module.css';

const getAssessmentLabelByValue = (): Record<string, string> => ({
  PROTECTED: localization.products.assessment.protected,
  OPEN: localization.products.assessment.open,
  SENSITIVE: localization.products.assessment.sensitive,
});

const getStorageCategoryLabelByValue = (): Record<string, string> => ({
  SHARED: localization.products.storageCategory.shared,
  PRODUCT: localization.products.storageCategory.product,
});

const sortOptionsAuthenticated = ['titleAsc', 'titleDesc', 'violationsDesc'] as const;
const sortOptionsUnauthenticated = ['titleAsc', 'titleDesc'] as const;

type DatasetSortOption = (typeof sortOptionsAuthenticated)[number];

export default function DataProductDetail({
  dataProduct,
  datasetsShared,
  datasetsProduct,
  namingStandardViolationsByDatasetId,
}: Readonly<{
  dataProduct: DataProductDTO;
  datasetsShared: DatasetDTO[];
  datasetsProduct: DatasetDTO[];
  namingStandardViolationsByDatasetId: Record<string, number>;
}>) {
  const assessmentLabelByValue = getAssessmentLabelByValue();
  const storageCategoryLabelByValue = getStorageCategoryLabelByValue();
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated && dataProduct.contains_valid_datasets === false) {
    notFound();
  }

  const visibleDatasets = isAuthenticated ? [...datasetsShared, ...datasetsProduct] : datasetsShared.filter((ds) => !ds.has_naming_standard_violations);

  const assessmentFilters = useMemo<FilterItem[]>(
    () =>
      Object.keys(assessmentLabelByValue).map((value) => ({
        value,
        label: assessmentLabelByValue[value] ?? value,
      })),
    [assessmentLabelByValue],
  );

  const storageCategoryFilters = useMemo<FilterItem[]>(
    () =>
      Object.keys(storageCategoryLabelByValue).map((value) => ({
        value,
        label: storageCategoryLabelByValue[value] ?? value,
      })),
    [storageCategoryLabelByValue],
  );

  const [selectedAssessments, setSelectedAssessments] = useState<FilterItem[]>([]);
  const [selectedStorageCategories, setSelectedStorageCategories] = useState<FilterItem[]>([]);
  const [sortBy, setSortBy] = useState<DatasetSortOption>('titleAsc');

  const toggleAssessment = (filter: FilterItem) => {
    setSelectedAssessments((prev) => {
      const exists = prev.some((f) => f.value === filter.value);
      return exists ? prev.filter((f) => f.value !== filter.value) : [...prev, filter];
    });
  };

  const toggleStorageCategory = (filter: FilterItem) => {
    setSelectedStorageCategories((prev) => {
      const exists = prev.some((f) => f.value === filter.value);
      return exists ? prev.filter((f) => f.value !== filter.value) : [...prev, filter];
    });
  };

  const filteredDatasets = useMemo(() => {
    if (selectedAssessments.length === 0 && selectedStorageCategories.length === 0) return visibleDatasets;

    const selectedAssessmentValues = new Set(selectedAssessments.map((f) => f.value));
    const selectedStorageCategoryValues = new Set(selectedStorageCategories.map((f) => f.value));

    return visibleDatasets.filter((dataset) => {
      const assessment = dataset.assessment;
      const storageCategory = dataset.storage_category;
      const assessmentMatches = typeof assessment === 'string' && selectedAssessmentValues.has(assessment);
      const storageCategoryMatches = typeof storageCategory === 'string' && selectedStorageCategoryValues.has(storageCategory);

      if (selectedAssessments.length > 0 && selectedStorageCategories.length > 0) {
        return assessmentMatches && storageCategoryMatches;
      }
      if (selectedAssessments.length > 0) {
        return assessmentMatches;
      }
      if (selectedStorageCategories.length > 0) {
        return storageCategoryMatches;
      }
      return true;
    });
  }, [visibleDatasets, selectedAssessments, selectedStorageCategories]);

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

  const availableSortOptions = isAuthenticated ? sortOptionsAuthenticated : sortOptionsUnauthenticated;

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
              <CheckboxFilter
                filterHeading={localization.products.assessment.filterLabel}
                filters={assessmentFilters}
                selectedItems={selectedAssessments}
                onFilterChange={toggleAssessment}
              />
              <CheckboxFilter
                filterHeading={localization.products.storageCategory.filterLabel}
                filters={storageCategoryFilters}
                selectedItems={selectedStorageCategories}
                onFilterChange={toggleStorageCategory}
              />
            </FiltersPanel>
          </aside>
          <section className={styles.mainSection}>
            <div className={styles.controlsSection}>
              <Heading level={2} className={`${styles.sectionHeading} secondaryHeading`}>
                {localization.dataProductDetail.dataset}
              </Heading>
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
            <div className={styles.datasetList}>
              {sortedDatasets.map((d) => (
                <DatasetSearchHit
                  key={d.id ?? `${d.product_short_name}-${d.short_description}`}
                  dataset={d}
                  namingStandardViolationsCount={d.id ? (namingStandardViolationsByDatasetId[d.id] ?? 0) : 0}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
