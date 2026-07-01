'use client';

import { Divider, Heading, Paragraph, Tabs, Tag } from '@digdir/designsystemet-react';
import { usePathname, useRouter } from 'next/navigation';
import { SubscribeButton } from '@/app/(details)/classifications/components/subscribe';
import { DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { localization } from '@/libs/language';
import { getHomeBreadcrumb } from '@/utils/breadcrumbs';
import styles from './classification-page.module.css';
import { classificationDetailsTabsData, getClassificationDetailsTabForRoute } from './tabs';

export default function ClassificationDetail({
  classification,
  children,
}: Readonly<{ classification: ClassificationResource; children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = getClassificationDetailsTabForRoute(pathname) ?? classificationDetailsTabsData.Codes;

  const validTag = true;
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
        {classification.description && <Paragraph className={`${styles.description} ingress`}>{classification.description}</Paragraph>}
        <SubscribeButton classificationId={classification.id} />
        <Divider />
        <Heading className={`${styles.detailsHeading} primaryHeading`} data-size='lg' level={2}>
          Versjonens navn
        </Heading>
        {validTag && <Tag>Er dette dagens versjon?</Tag>}
        <Tabs value={activeTab.id}>
          <Tabs.List aria-label={localization.tabs.ariaLabel}>
            {Object.values(classificationDetailsTabsData).map((tab) => (
              <Tabs.Tab
                aria-controls={tab.id}
                key={tab.id}
                value={tab.id}
                className={`${styles.tab} font-roboto`}
                onClick={() => router.push(`/classifications/${classification.id}/${tab.slug}`)}
              >
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Tabs.Panel value={activeTab.id}>{children}</Tabs.Panel>
        </Tabs>
      </main>
    </div>
  );
}
