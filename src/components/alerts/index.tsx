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
  onClose?: () => void;
}

export function ClosableAlert({ heading, message, color = 'info', onClose }: Readonly<ClosableAlertProps>) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Alert className={styles.alert} data-color={color} role='status'>
      {heading && (
        <Heading className={`infoHeadingSecondary ${styles.heading}`} level={2} data-size='sm'>
          {heading}
        </Heading>
      )}
      {message && (
        <Paragraph className={styles.message} data-size='md'>
          {message}
        </Paragraph>
      )}
      <Button
        className={styles.closeButton}
        data-color='secondary'
        variant='tertiary'
        icon
        aria-label={localization.close}
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
      >
        <XMarkIcon aria-hidden='true' focusable='false' />
      </Button>
    </Alert>
  );
}
