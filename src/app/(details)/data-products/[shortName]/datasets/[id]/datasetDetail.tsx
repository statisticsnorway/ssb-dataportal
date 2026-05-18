'use client';

import { Card, Divider, Heading } from '@digdir/designsystemet-react';
import { tabsData } from '@/app/(services)/tabs';
import { DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { DetailsTable } from '@/components/details-list';
import { CopyTag } from '@/components/tag-components/copy-tag';
import { DaplaDataFileDTO, DatasetDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';
import { getHomeBreadcrumb } from '@/utils/breadcrumbs';
import { sortDateStringsDescending } from '@/utils/sort';
import styles from './dataset-page.module.css';

export default function DatasetDetail({
  dataset: dataset,
  dataFiles: dataFiles,
}: Readonly<{
  dataset: DatasetDTO;
  dataFiles: Array<DaplaDataFileDTO>;
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
        <DetailsTable
          title={'Om datasettet'}
          content={[
            { label: 'Dataprodukt', value: dataset.product_short_name },
            { label: 'Bøtte', value: dataset.storage_location_name },
            { label: 'Datatilstand', value: dataset.dataset_state },
            { label: 'Vurdering', value: dataset.assessment },
            { label: 'Eier', value: dataset.owner },
            { label: 'ID', value: <CopyTag text={dataset.id ?? 'undefined'} copyType='id' /> },
          ]}
        />
        <Card className={styles.tableContainer}>
          <Heading level={2} className={styles.detailsHeading} data-size='md' id={`tableHeading-dataFiles`}>
            Datafiler
          </Heading>
          {dataFiles
            .sort((a, b) =>
              sortDateStringsDescending(
                a.contains_data_from?.toISOString().split('T')[0],
                b.contains_data_from?.toISOString().split('T')[0],
              ),
            )
            .map((dataFile, index) => (
              <dl key={index} className={styles.row}>
                <dt className={styles.key}>{dataFile.contains_data_from?.toLocaleDateString()}</dt>
                <dd className={styles.value}>{dataFile.file_path}</dd>
                <Divider />
              </dl>
            ))}
        </Card>
      </main>
    </div>
  );
}
