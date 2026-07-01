import { Alert, Heading } from '@digdir/designsystemet-react';
import { BreadcrumbItem, DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { localization } from '@/libs/language';
import styles from './classification-page.module.css';

export default function ClassificationDetail({ classification }: Readonly<{ classification: ClassificationResource }>) {
  const homeUrl = { text: localization.tabs.classifications, href: `/classifications` };
  const breadcrumbList = classification ? ([{ text: classification.name, href: '' }] as BreadcrumbItem[]) : [];

  return (
    <section className={`${styles.detailsPage} container`}>
      <DataportalBreadcrumbs items={breadcrumbList} homeUrl={homeUrl} />
      <main className={styles.detailsPage}>
        <Heading className={`${styles.detailsHeading} primaryHeading`} data-size='xl' level={1}>
          {classification.name}
        </Heading>
        <Alert data-color={'warning'} className='infoAlert'>
          Detaljside for klassifikasjon er ikke klar for testing.
        </Alert>
      </main>
    </section>
  );
}
