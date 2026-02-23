'use client';

import { Alert } from '@digdir/designsystemet-react';
import { tabsData } from '@/app/(services)/tabs';
import { VardefBreadcrumbs } from '@/components/vardef-breadcrumbs';
import { localization } from '@/libs/language';
import { getHomeBreadcrumb } from '@/utils/breadcrumbs';
import styles from './variable-details-page.module.css';

export default function NotFound() {
  return (
    <div className={`${styles.detailsPage} container`}>
      <VardefBreadcrumbs
        homeUrl={getHomeBreadcrumb()}
        items={[{ text: localization.variableDefinition.labelPlural, href: tabsData.VariableDefinitions.route }]}
        currentText={localization.error.notFound}
      />
      <Alert className={styles.alert} data-color='warning'>
        {localization.variableDefinition.notFoundAlertText}
      </Alert>
    </div>
  );
}
