'use client';

import { Alert, Button } from '@digdir/designsystemet-react';
import { XMarkIcon } from '@navikt/aksel-icons';
import { useEffect, useState } from 'react';
import { cookieBannerDismissedCookieName, getCookieValue, localization, setPreferenceCookie } from '@/libs/language';
import styles from './cookie-banner.module.css';

const dismissedValue = 'true';

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const isDismissed = getCookieValue(cookieBannerDismissedCookieName) === dismissedValue;
    setIsVisible(!isDismissed);
    setIsReady(true);
  }, []);

  const onClose = () => {
    setPreferenceCookie(cookieBannerDismissedCookieName, dismissedValue);
    setIsVisible(false);
  };

  if (!isReady || !isVisible) {
    return null;
  }

  return (
    <section className='containerBox' aria-label='Cookie banner'>
      <Alert data-color='info' className={styles.content}>
        <p>{localization.cookieBanner.message}</p>
        <Button className={styles.closeButton} variant='tertiary' onClick={onClose} icon={true}>
          <XMarkIcon aria-hidden />
        </Button>
      </Alert>
    </section>
  );
};
