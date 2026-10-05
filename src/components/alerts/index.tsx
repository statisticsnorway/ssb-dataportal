'use client';

import { Alert, Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { XMarkIcon } from '@navikt/aksel-icons';
import { type ReactNode, useEffect, useState } from 'react';
import { getCookieValue, localization, setPreferenceCookie } from '@/libs/language';
import styles from './alerts.module.css';

const dismissedValue = 'true';

interface ClosableAlertProps {
  heading?: ReactNode;
  message?: ReactNode;
  extraContent?: ReactNode;
  color?: 'info' | 'success' | 'warning' | 'danger';
  persistDismissalCookieName?: string;
  onClose?: () => void;
}

export function ClosableAlert({
  heading,
  message,
  extraContent,
  color = 'info',
  persistDismissalCookieName,
  onClose,
}: Readonly<ClosableAlertProps>) {
  const [visible, setVisible] = useState(!persistDismissalCookieName);
  const [isReady, setIsReady] = useState(!persistDismissalCookieName);
  const [dismissedOnLoad, setDismissedOnLoad] = useState(false);

  useEffect(() => {
    if (!persistDismissalCookieName) {
      return;
    }

    const isDismissed = getCookieValue(persistDismissalCookieName) === dismissedValue;
    setVisible(!isDismissed);
    setDismissedOnLoad(isDismissed);
    setIsReady(true);
  }, [persistDismissalCookieName]);

  if (!isReady || dismissedOnLoad) {
    return null;
  }

  return (
    <div className={`${styles.alertWrap} ${visible ? '' : styles.alertWrapClosing}`}>
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
        {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
        <Button
          className={styles.closeButton}
          data-color='secondary'
          variant='tertiary'
          icon
          aria-label={localization.close}
          onClick={() => {
            if (persistDismissalCookieName) {
              setPreferenceCookie(persistDismissalCookieName, dismissedValue);
            }
            setVisible(false);
            onClose?.();
          }}
        >
          <XMarkIcon aria-hidden='true' focusable='false' />
        </Button>
      </Alert>
    </div>
  );
}
