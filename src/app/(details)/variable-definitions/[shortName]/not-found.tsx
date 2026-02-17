'use client';

import { Alert } from '@digdir/designsystemet-react';
import { tabsData } from '@/app/(services)/tabs';
import { BreadcrumbType, VardefBreadcrumbs } from '@/components/vardef-breadcrumbs';
import { localization } from '@/libs/language';
import styles from './variable-details-page.module.css';

export default function NotFound() {
  const homeUrl = { text: localization.home, href: '/' };
  const breadcrumbList: BreadcrumbType[] = [
    { text: localization.variableDefinition.labelPlural, href: tabsData.VariableDefinitions.route },
    { text: '404', href: '' },
  ];

  return (
    <div className={`${styles.detailsPage} container`}>
      <VardefBreadcrumbs breadcrumbList={breadcrumbList} homeUrl={homeUrl} />
      <Alert className={styles.alert} data-color='warning'>
        {localization.variableDefinition.notFound}
      </Alert>
    </div>
  );
}
