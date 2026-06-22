import { Alert, Heading } from '@statisticsnorway/design-react';
import { BreadcrumbItem, DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { ClassificationResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import styles from './classification-page.module.css';

export default function ClassificationDetail({ classification }: Readonly<{ classification: ClassificationResource }>) {
  const homeUrl = { text: localization.tabs.classifications, href: `/classifications` };
  const breadcrumbList = classification.id ? ([{ text: classification.name, href: '' }] as BreadcrumbItem[]) : [];

  return (
    <section className={`${styles.detailsPage} container`}>
      <DataportalBreadcrumbs items={breadcrumbList} homeUrl={homeUrl} />
      <header>
        <Heading className={`${styles.detailsPageHeader} primaryHeading`} level={1} data-size='lg'>
          {classification.name}
        </Heading>
      </header>
      <main className={styles.detailsPage}>
        <Alert data-color={'warning'} className='infoAlert'>
          Detaljside for klassifikasjon er ikke klar for testing.
        </Alert>
      </main>
    </section>
  );
}
