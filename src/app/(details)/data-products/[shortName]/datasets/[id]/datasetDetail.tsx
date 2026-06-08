'use client';

import { Badge, Card, Divider, Heading, Tag, Tooltip } from '@digdir/designsystemet-react';
import { tabsData } from '@/app/(services)/tabs';
import { useAuthContext } from '@/app/authContext';
import DataCoverageTimeline from '@/components/data-coverage-timeline/dataCoverageTimeline';
import { DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { DetailsTable } from '@/components/details-list';
import { ExternalLink } from '@/components/link-components/externalLink';
import { CopyTag } from '@/components/tag-components/copy-tag';
import { DaplaDataFileDTO, DatasetDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';
import { getHomeBreadcrumb } from '@/utils/breadcrumbs';
import { getDaplaCtrlUrl } from '@/utils/config';
import { convertAssessment, convertDataSetState } from '@/utils/functions';
import { sortDateStringsDescending } from '@/utils/sort';
import styles from './dataset-page.module.css';

export default function DatasetDetail({
  dataset: dataset,
  dataFiles: dataFiles,
}: Readonly<{
  dataset: DatasetDTO;
  dataFiles: Array<DaplaDataFileDTO>;
}>) {
  const { isAuthenticated } = useAuthContext();
  const normalizedDataFiles = dataFiles.map((dataFile) => ({
    ...dataFile,
    naming_standard_violations: dataFile.naming_standard_violations ?? [],
  }));

  if (!isAuthenticated) {
    dataFiles = normalizedDataFiles.filter((df) => df.naming_standard_violations.length === 0);
  } else {
    dataFiles = normalizedDataFiles;
  }

  const totalNamingStandardViolations = dataFiles.reduce(
    (total, dataFile) => total + dataFile.naming_standard_violations.length,
    0,
  );

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
        <Heading className={`${styles.detailsHeading} primaryHeading`} data-size='xl' level={1}>
          {dataset.short_description}
        </Heading>
        <DetailsTable
          title={localization.datasetDetail.aboutDataset}
          content={[
            { label: localization.datasetDetail.dataProduct, value: dataset.product_short_name },
            { label: localization.datasetDetail.bucket, value: dataset.storage_location_name },
            {
              label: localization.datasetDetail.datasetState,
              value: dataset.dataset_state && (
                <Tag data-color='success'>{convertDataSetState(dataset.dataset_state)}</Tag>
              ),
            },
            {
              label: localization.datasetDetail.assessment,
              value: dataset.assessment && <Tag data-color='warning'> {convertAssessment(dataset.assessment)}</Tag>,
            },
            {
              label: localization.datasetDetail.responsible,
              value: (
                <ExternalLink
                  linkText={dataset.owner ?? 'undefined'}
                  href={`${getDaplaCtrlUrl()}/team/${dataset.owner}`}
                />
              ),
            },
            {
              label: localization.datasetDetail.namingStandardViolations,
              value: (
                <Badge
                  count={totalNamingStandardViolations}
                  data-color='warning'
                  data-size='sm'
                  className={styles.violationBadge}
                  aria-label={`${totalNamingStandardViolations}`}
                />
              ),
            },
            { label: localization.datasetDetail.id, value: <CopyTag text={dataset.id ?? 'undefined'} copyType='id' /> },
          ]}
        />

        <DataCoverageTimeline data={dataFiles}></DataCoverageTimeline>

        <Card className={styles.tableContainer}>
          <Heading
            level={2}
            className={`${styles.detailsHeading} secondaryHeading`}
            data-size='md'
            id={`tableHeading-dataFiles`}
          >
            {localization.datasetDetail.dataFiles}
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
                <dd className={styles.value}>
                  <div className={styles.fileValue}>
                    <span className={styles.filePath}>{dataFile.file_path}</span>
                    {dataFile.naming_standard_violations.length > 0 ? (
                      <Tooltip content={dataFile.naming_standard_violations.join(', ')}>
                        <Badge
                          count={dataFile.naming_standard_violations.length}
                          data-color='warning'
                          data-size='sm'
                          className={styles.violationBadge}
                          aria-label={`${dataFile.naming_standard_violations.length} ${localization.datasetDetail.namingStandardViolations}`}
                        />
                      </Tooltip>
                    ) : null}
                  </div>
                </dd>
                <Divider />
              </dl>
            ))}
        </Card>
      </main>
    </div>
  );
}
