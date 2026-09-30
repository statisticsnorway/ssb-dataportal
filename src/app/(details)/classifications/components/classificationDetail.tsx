'use client';

import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { usePathname } from 'next/navigation';
import { SubscribeDialog } from '@/app/(details)/classifications/components/subscribe';
import { ClosableAlert } from '@/components/alerts';
import { DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { LanguageTag } from '@/components/language-tag';
import { ClassificationWithLanguage } from '@/libs/data/classifications/classificationData';
import { ClassificationVersionResource } from '@/libs/data-access/klass/models/ClassificationVersionResource';
import { localization } from '@/libs/language';
import { formatLanguages } from '@/utils/functions';
import { getClassificationDetailsTabForRoute } from '../[id]/tabs';
import { buildUrl } from '../utils/urls';
import styles from './classification-page.module.css';
import { VersionPicker } from './version-picker';
import { VersionView } from './views/VersionView';

interface ClassificationDetailProps {
  classification: ClassificationWithLanguage;
  classificationVersion?: ClassificationVersionResource | null;
  missingInSelectedLanguage?: boolean;
  children: React.ReactNode;
}
export default function ClassificationDetail({
  classification,
  classificationVersion,
  missingInSelectedLanguage,
  children,
}: Readonly<ClassificationDetailProps>) {
  const pathname = usePathname();
  const activeTab = getClassificationDetailsTabForRoute(pathname)?.slug ?? 'codes';

  return (
    <>
      <section className={`info-band ${styles.infoBand}`}>
        <div className='container'>
          <ClosableAlert
            heading={localization.migrationClassifications.header}
            message={localization.migrationClassifications.info}
          />
        </div>
      </section>
      <div className={`${styles.detailsPage} container`}>
        <DataportalBreadcrumbs
          items={[
            {
              text: localization.classification.labelPlural,
              href: buildUrl({}),
            },
          ]}
          currentText={classification.name ?? String(classification.id)}
        />
        <main className={styles.mainContent}>
          {classification.fallbackLanguage && (
            <div>
              <LanguageTag
                tooltipContent={localization.classification.language.notSelectedLanguage}
                title={formatLanguages(classification.fallbackLanguage)}
              />
            </div>
          )}
          <Heading
            className={`${styles.detailsHeading} primaryHeading`}
            data-size='lg'
            level={1}
            {...(classification.fallbackLanguage ? { lang: classification.fallbackLanguage } : {})}
          >
            {classification.name}
          </Heading>
          {classification.description && (
            <Paragraph
              className={`${styles.description} ingress`}
              {...(classification.fallbackLanguage ? { lang: classification.fallbackLanguage } : {})}
            >
              {classification.description}
            </Paragraph>
          )}
          <aside className={styles.actions}>
            <SubscribeDialog classificationId={classification.id} />
            <VersionPicker classification={classification} tab={activeTab} />
          </aside>
          <VersionView
            classification={classification}
            classificationVersion={classificationVersion}
            missingInSelectedLanguage={missingInSelectedLanguage}
          >
            {children}
          </VersionView>
        </main>
      </div>
    </>
  );
}
