'use client';

import { Alert, Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { XMarkIcon } from '@navikt/aksel-icons';
import { type ReactNode, useState } from 'react';
import { localization } from '@/libs/language/src/localization';
import styles from './alerts.module.css';

interface ClosableAlertProps {
  heading?: ReactNode;
  message?: ReactNode;
  color?: 'info' | 'success' | 'warning' | 'danger';
}

export function ClosableAlert({ heading, message, color = 'info' }: Readonly<ClosableAlertProps>) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Alert data-color={color} role='status'>
      <div className={styles.content}>
        <div className={styles.body}>
          {heading && <Heading className='secondaryHeading'>{heading}</Heading>}
          {message && <Paragraph data-size='md'>{message}</Paragraph>}
        </div>
        <Button variant='tertiary' data-size='sm' aria-label={localization.close} onClick={() => setVisible(false)}>
          <XMarkIcon aria-hidden='true' focusable='false' />
        </Button>
      </div>
    </Alert>
  );
}
