import { Alert } from '@digdir/designsystemet-react';
import { BreadcrumbItem, DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { localization } from '@/libs/language';
import styles from './classification-page.module.css';

export default function ClassificationDetail({ id }: Readonly<{ id: string }>) {
  const homeUrl = { text: localization.tabs.classifications, href: `/classifications` };
  const breadcrumbList = id ? ([{ text: id, href: '' }] as BreadcrumbItem[]) : [];

  return (
    <section className={`${styles.detailsPage} container`}>
      <DataportalBreadcrumbs items={breadcrumbList} homeUrl={homeUrl} />
      <main className={styles.detailsPage}>
        <Alert data-color={'warning'} className='infoAlert'>
          Detaljside for klassifikasjon er ikke klar for testing.
        </Alert>
      </main>
    </section>
  );
}
