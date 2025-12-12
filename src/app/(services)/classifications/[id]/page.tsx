'use client';
import { Heading } from '@digdir/designsystemet-react';
import { useParams } from 'next/navigation';
import { Breadcrumbs, BreadcrumbType } from '@/components/breadcrumbs';
import { localization } from '@/libs/language';
import { CLASSIFICATIONS, KLASSIFIKASJONER } from '@/utils/constants';
import { useKlassTabData } from '@/utils/klassTabContext';
import styles from './classification-page.module.css';

export default function Classification() {
  const params = useParams();
  const id = Number(params?.id);

  const klassData = useKlassTabData();
  const classification = klassData.klassClassifications.find((v) => v.id === id);

  if (!classification) {
    return <div>Variabeldefinisjon ikke funnet</div>;
  }

  const homeUrl = { text: KLASSIFIKASJONER, href: `/${CLASSIFICATIONS}` };
  const breadcrumbList = classification.id ? ([{ text: classification.name, href: '' }] as BreadcrumbType[]) : [];

  return (
    <section className={`${styles.detailsPage} container`}>
      <Breadcrumbs
        breadcrumbList={breadcrumbList}
        homeUrl={homeUrl}
        breadcrumbHomeAriaLabel={localization.navigateHomeClassifications}
      />
      <header className={styles.detailsPageHeader}>
        <Heading className={styles.classificationHeading} level={1} data-size='lg'>
          {classification.name}
        </Heading>
      </header>
    </section>
  );
}
