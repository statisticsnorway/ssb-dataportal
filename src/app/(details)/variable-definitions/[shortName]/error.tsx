'use client';

import { Alert, Button } from '@digdir/designsystemet-react';
import { useEffect } from 'react';
import { localization } from '@/libs/language';
import styles from './variable-details-page.module.css';

export default function VariableDefinitionError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Failed to render variable definition details page', error);
  }, [error]);
  return (
    <div className={`${styles.detailsPage} container`}>
      <Alert className={styles.alert} data-color='danger' role='alert'>
        {localization.error.somethingWentWrong}
      </Alert>
      <div style={{ marginTop: '1rem' }}>
        <Button onClick={() => reset()}>{localization.error.tryAgainButtonText}</Button>
      </div>
    </div>
  );
}
