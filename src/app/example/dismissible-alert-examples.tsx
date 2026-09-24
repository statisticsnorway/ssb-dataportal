'use client';

import { Button } from '@digdir/designsystemet-react';
import { useState } from 'react';
import { ClosableAlert } from '@/components/alerts';
import styles from './example.module.css';

export function DismissibleAlertExamples() {
  const [visible, setVisible] = useState(true);

  return (
    <div className={styles.alertExamples}>
      {visible && (
        <ClosableAlert
          heading='Centered close button'
          message='The info icon aligns with the title while the close button centers on the alert.'
          onClose={() => setVisible(false)}
        />
      )}

      {!visible && <Button onClick={() => setVisible(true)}>Show example</Button>}
    </div>
  );
}
