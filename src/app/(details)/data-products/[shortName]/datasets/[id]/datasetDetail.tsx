'use client';

import { Heading } from '@digdir/designsystemet-react';
import { tabsData } from '@/app/(services)/tabs';
import { DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { DetailsTable } from '@/components/details-list';
import { CopyTag } from '@/components/tag-components/copy-tag';
import { DatasetDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';
import { getHomeBreadcrumb } from '@/utils/breadcrumbs';
import styles from './dataset-page.module.css';

export default function DatasetDetail({
  dataset: dataset,
}: Readonly<{
  dataset: DatasetDTO;
}>) {
  return (
    <div className={`${styles.detailsPage} container`}>
      <DataportalBreadcrumbs
        homeUrl={getHomeBreadcrumb()}
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
        <Heading className={styles.detailsHeading} data-size='2xl' level={1}>
          {dataset.short_description}
        </Heading>
        {dataset.id != null && <CopyTag text={dataset.id} />}
        <DetailsTable
          title={'Om datasettet'}
          content={[
            { label: 'Dataprodukt', value: dataset.product_short_name },
            { label: 'Bøtte', value: dataset.storage_location_name },
            { label: 'Datatilstand', value: dataset.dataset_state },
            { label: 'Vurdering', value: dataset.assessment },
            { label: 'Eier', value: dataset.owner },
          ]}
        />
      </main>
    </div>
  );
}
