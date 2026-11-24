'use client';

import { Badge, Heading, Tag } from '@digdir/designsystemet-react';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { tabsData } from '@/app/(services)/tabs';
import { useAuthContext } from '@/app/authContext';
import { DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { DetailsList } from '@/components/details-list';
import { ExternalLink } from '@/components/link-components/externalLink';
import { CopyTag } from '@/components/tag-components/copy-tag';
import type { DaplaDataFileDTO, DatasetDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';
import { Visibility } from '@/types/item';
import { getDaplaCtrlUrl } from '@/utils/config';
import { convertAssessment, convertDataSetState } from '@/utils/functions';
import styles from './dataset-page.module.css';
import { getPublicDataFiles } from './getPublicDataFiles';

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
        {
          label: 'Label',
          value: 'This is a placeholder',
        },
      ]}
    />
  );
}

export default function DatasetDetail({
  dataset,
  dataFilesShared,
  dataFilesProduct,
  datasetVariablesWorkspace,
}: Readonly<{
  dataset: DatasetDTO;
  dataFilesShared: DaplaDataFileDTO[];
  dataFilesProduct: DaplaDataFileDTO[];
  datasetVariablesWorkspace: ReactNode;
}>) {
  const { isAuthenticated } = useAuthContext();
  if (!isAuthenticated && dataset.has_naming_standard_violations === true) notFound();

  const dataFiles = isAuthenticated ? [...dataFilesShared, ...dataFilesProduct] : getPublicDataFiles(dataFilesShared);
  const totalNamingStandardViolations = dataFiles.reduce(
    (total, file) => total + (file.naming_standard_violations?.length ?? 0),
    0,
  );

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
        {datasetVariablesWorkspace}
      </main>
    </div>
  );
}
