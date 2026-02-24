'use client';

import { Alert } from '@digdir/designsystemet-react';
import { localization } from '@/libs/language';
import styles from './variable-details-page.module.css';

export default function NotFound() {
  return (
    <div className={`${styles.detailsPage} container`}>
      <Alert className={styles.alert} data-color='warning'>
        {localization.variableDefinition.notFoundAlertText}
      </Alert>
    </div>
  );
}
