'use client';

import { Divider, Heading, Paragraph } from '@digdir/designsystemet-react';
import { SubscribeDialog } from '@/app/(details)/classifications/components/subscribe';
import { DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { localization } from '@/libs/language';
import { getHomeBreadcrumb } from '@/utils/breadcrumbs';
import styles from './classification-page.module.css';
import { VersionView } from './views/VersionView';

interface ClassificationDetailProps {
  classification: ClassificationResource;
  children: React.ReactNode;
}
export default function ClassificationDetail({ classification, children }: Readonly<ClassificationDetailProps>) {
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
        <Heading className={`${styles.detailsHeading} primaryHeading`} data-size='xl' level={1}>
          {classification.name}
        </Heading>
        {classification.description && (
          <Paragraph className={`${styles.description} ingress`}>{classification.description}</Paragraph>
        )}
        <SubscribeDialog classificationId={classification.id} />
        <Divider />
        <VersionView classification={classification}>{children}</VersionView>
      </main>
    </div>
  );
}
