'use client';

import { Heading } from '@digdir/designsystemet-react';
import { useEffect, useState } from 'react';
import { tabsData } from '@/app/(services)/tabs';
import { useAuthContext } from '@/app/authContext';
import { DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { doesDatasetHaveAnyValidFiles } from '@/libs/data/datasets/datasets';
import { DataProductDTO, DatasetDTO } from '@/libs/data-access/datadoc/models';
import { localization } from '@/libs/language';
import { getHomeBreadcrumb } from '@/utils/breadcrumbs';
import { DatasetSearchHit } from './components/DatasetSearchHit';
import styles from './page.module.css';

export default function DataProductDetail({
  dataProduct,
  datasets,
}: {
  dataProduct: DataProductDTO;
  datasets: DatasetDTO[];
}) {
  const { isAuthenticated } = useAuthContext();
  const [visibleDatasets, setVisibleDatasets] = useState<DatasetDTO[]>(() => (isAuthenticated ? datasets : []));

  useEffect(() => {
    let cancelled = false;

    if (isAuthenticated) {
      setVisibleDatasets(datasets);
      return;
    }

    const filterDatasets = async () => {
      const hasValidFiles = await Promise.all(
        datasets.map(async (dataset) => (dataset.id ? doesDatasetHaveAnyValidFiles(dataset.id) : false)),
      );

      if (!cancelled) {
        setVisibleDatasets(datasets.filter((_, index) => hasValidFiles[index]));
      }
    };

    void filterDatasets();

    return () => {
      cancelled = true;
    };
  }, [datasets, isAuthenticated]);

  return (
    <div className={`${styles.detailsPage} container`}>
      <DataportalBreadcrumbs
        homeUrl={getHomeBreadcrumb()}
        items={[{ text: localization.tabs.dataProducts, href: tabsData.DataProducts.route }]}
        currentText={dataProduct.title ?? dataProduct.product_short_name ?? undefined}
      />

      <main className={styles.mainContent}>
        <Heading className={`${styles.detailsHeading} primaryHeading`} data-size='2xl' level={1}>
          {dataProduct.title ?? dataProduct.product_short_name}
        </Heading>

        <section>
          <Heading level={2} className={`${styles.sectionHeading} secondaryHeading`}>
            Datasett
          </Heading>
          <div className={styles.datasetList}>
            {visibleDatasets.map((d) => (
              <DatasetSearchHit key={d.id ?? `${d.product_short_name}-${d.short_description}`} dataset={d} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
