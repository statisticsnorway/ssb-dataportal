'use client';

import { Alert, Button } from '@digdir/designsystemet-react';
import { useEffect } from 'react';
import { tabsData } from '@/app/(services)/tabs';
import { BreadcrumbType, VardefBreadcrumbs } from '@/components/vardef-breadcrumbs';
import { localization } from '@/libs/language';
import styles from './variable-details-page.module.css';

export default function VariableDefinitionError({ error, reset }: { error: Error; reset: () => void }) {
  const homeUrl = { text: localization.home, href: '/' };
  const breadcrumbList: BreadcrumbType[] = [
    { text: localization.variableDefinition.labelPlural, href: tabsData.VariableDefinitions.route },
    { text: localization.error.breadcrumbs, href: '' },
  ];
  useEffect(() => {
    console.error('Failed to render variable definition details page', error);
  }, [error]);
  return (
    <div className={`${styles.detailsPage} container`}>
      <VardefBreadcrumbs breadcrumbList={breadcrumbList} homeUrl={homeUrl} />
      <Alert className={styles.alert} data-color='danger' role='alert'>
        {localization.error.somethingWentWrong}
      </Alert>
      <div style={{ marginTop: '1rem' }}>
        <Button onClick={() => reset()}>{localization.error.tryAgain}</Button>
      </div>
    </div>
  );
}
