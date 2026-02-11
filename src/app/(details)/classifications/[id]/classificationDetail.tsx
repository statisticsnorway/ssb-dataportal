'use client';

import { Alert, Heading } from '@digdir/designsystemet-react';
import { BreadcrumbType, VardefBreadcrumbs } from '@/components/vardef-breadcrumbs';
import { ClassificationResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import styles from './classification-page.module.css';

export default function ClassificationDetail({ classification }: { classification: ClassificationResource }) {
  const homeUrl = { text: localization.tabs.classifications, href: `/classifications` };
  const breadcrumbList = classification.id ? ([{ text: classification.name, href: '' }] as BreadcrumbType[]) : [];

  return (
    <section className={`${styles.detailsPage} container`}>
      <VardefBreadcrumbs breadcrumbList={breadcrumbList} homeUrl={homeUrl} />
      <header>
        <Heading className={styles.classificationHeading} level={1} data-size='lg'>
          {classification.name}
        </Heading>
      </header>
      <main className={styles.classificationsDetail}>
        <Alert data-color={'warning'} className='infoAlert' data-size={'md'}>
          Detaljside for klassifikasjon er ikke klar for testing.
        </Alert>
      </main>
    </section>
  );
}
