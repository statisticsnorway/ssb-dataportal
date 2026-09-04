'use client';

import { Heading } from '@digdir/designsystemet-react';
import { notFound } from 'next/navigation';
import { useMemo, useState } from 'react';
import { tabsData } from '@/app/(services)/tabs';
import { useAuthContext } from '@/app/authContext';
import { DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { CheckboxFilter, FiltersPanel } from '@/components/filters';
import { DataProductDTO, DatasetDTO } from '@/libs/data-access/datadoc/models';
import { localization } from '@/libs/language';
import { FilterItem } from '@/types/filters';
import { getHomeBreadcrumb } from '@/utils/breadcrumbs';
import { DatasetSearchHit } from './components/DatasetSearchHit';
import styles from './page.module.css';

const getAssessmentLabelByValue = (): Record<string, string> => ({
  PROTECTED: localization.products.assessment.protected,
  OPEN: localization.products.assessment.open,
  SENSITIVE: localization.products.assessment.sensitive,
});

export default function DataProductDetail({
  dataProduct,
  datasets,
}: Readonly<{
  dataProduct: DataProductDTO;
  datasets: DatasetDTO[];
}>) {
  const assessmentLabelByValue = getAssessmentLabelByValue();
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated && dataProduct.has_naming_standard_violations === true) {
    notFound();
  }

  const visibleDatasets = isAuthenticated ? datasets : datasets.filter((ds) => !ds.has_naming_standard_violations);

  const assessmentFilters = useMemo<FilterItem[]>(
    () =>
      Object.keys(assessmentLabelByValue).map((value) => ({
        value,
        label: assessmentLabelByValue[value] ?? value,
      })),
    [assessmentLabelByValue],
  );

  const [selectedAssessments, setSelectedAssessments] = useState<FilterItem[]>([]);

  const toggleAssessment = (filter: FilterItem) => {
    setSelectedAssessments((prev) => {
      const exists = prev.some((f) => f.value === filter.value);
      return exists ? prev.filter((f) => f.value !== filter.value) : [...prev, filter];
    });
  };

  const filteredDatasets = useMemo(() => {
    if (selectedAssessments.length === 0) return visibleDatasets;

    const selectedValues = new Set(selectedAssessments.map((f) => f.value));
    return visibleDatasets.filter((dataset) => {
      const assessment = dataset.assessment;
      return typeof assessment === 'string' && selectedValues.has(assessment);
    });
  }, [visibleDatasets, selectedAssessments]);

  return (
    <div className={`${styles.detailsPage} container`}>
      <DataportalBreadcrumbs
        homeUrl={getHomeBreadcrumb()}
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
            </FiltersPanel>
          </aside>
          <section className={styles.mainSection}>
            <Heading level={2} className={`${styles.sectionHeading} secondaryHeading`}>
              {localization.dataProductDetail.dataset}
            </Heading>
            <div className={styles.datasetList}>
              {filteredDatasets.map((d) => (
                <DatasetSearchHit key={d.id ?? `${d.product_short_name}-${d.short_description}`} dataset={d} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
