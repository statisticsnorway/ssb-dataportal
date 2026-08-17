'use client';

import { Alert, Divider, Heading, Paragraph } from '@digdir/designsystemet-react';
import { SubscribeDialog } from '@/app/(details)/classifications/components/subscribe';
import { DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { ClassificationWithLanguage } from '@/libs/data/classifications/classificationData';
import { ClassificationVersionResource } from '@/libs/data-access/klass/models/ClassificationVersionResource';
import { localization } from '@/libs/language';
import { getHomeBreadcrumb } from '@/utils/breadcrumbs';
import { formatLanguages } from '@/utils/functions';
import { mapVersions } from '../utils/versions';
import styles from './classification-page.module.css';
import { ClassificationTable } from './classification-table';
import { ExpandableTable } from './expandable-table';
import { VersionView } from './views/VersionView';

interface ClassificationDetailProps {
  classification: ClassificationWithLanguage;
  classificationVersion?: ClassificationVersionResource | null;
  children: React.ReactNode;
}
export default function ClassificationDetail({
  classification,
  classificationVersion,
  children,
}: Readonly<ClassificationDetailProps>) {
  return (
    <div className={`${styles.detailsPage} container`}>
      <DataportalBreadcrumbs
        homeUrl={getHomeBreadcrumb()}
        items={[
          {
            text: localization.classification.labelPlural,
            href: `/classifications`,
          },
        ]}
        currentText={classification.name ?? String(classification.id)}
      />
      <main className={styles.mainContent}>
        {classification.fallbackLanguage && (
          <Alert role='status'>
            {localization.classification.language.notSelectedLanguage}.{' '}
            {localization.classification.language.displayedInLanguage.replace(
              '{language}',
              formatLanguages(classification.fallbackLanguage),
            )}
          </Alert>
        )}
        <Heading className={`${styles.detailsHeading} primaryHeading`} data-size='lg' level={1}>
          {classification.name}
        </Heading>
        {classification.description && (
          <Paragraph className={`${styles.description} ingress`}>{classification.description}</Paragraph>
        )}
        <SubscribeDialog classificationId={classification.id} />
        <ExpandableTable
          title={localization.classificationDetails.versions}
          table={
            <ClassificationTable
              sortableField={localization.versions.validFrom}
              content={(classification.versions ?? []).map((v) => mapVersions(v, classification.id))}
            />
          }
        />
        <Divider />
        <VersionView classification={classification} classificationVersion={classificationVersion}>
          {children}
        </VersionView>
      </main>
    </div>
  );
}
