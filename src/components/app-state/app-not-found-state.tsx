'use client';

import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { localization } from '@/libs/language';
import styles from './app-state.module.css';

type AppNotFoundStateProps = Readonly<{
  title?: string;
  message?: string;
  helpList?: string[];
  homeHref?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  showBrokenLinkButton?: boolean;
}>;

export function AppNotFoundState({
  title = 'Siden finnes ikke',
  message = 'Siden kan være flyttet, slettet eller lenken kan være feil.',
  helpList,
  homeHref = '/',
  secondaryHref,
  secondaryLabel,
  showBrokenLinkButton = true,
}: AppNotFoundStateProps) {
  const path = usePathname();
  const body = encodeURIComponent(localization.error.brokenLinkMailBody(path));
  const mailto = `mailto:metadata@ssb.no?subject=${encodeURIComponent(localization.error.brokenLinkMailSubject)} &body=${body}`;
  return (
    <section className={styles.wrapper} aria-labelledby='app-not-found-title'>
      <div className={styles.content}>
        <Heading id='app-not-found-title' level={1} data-size='lg'>
          {title}
        </Heading>
        <Paragraph className={styles.lead}>{message}</Paragraph>
        {helpList && helpList.length > 0 && (
          <div className={styles.help}>
            <Paragraph>Du kan prøve å:</Paragraph>
            <ul className={styles.helpList}>
              {helpList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        <div className={styles.actions}>
          <Button asChild>
            <Link href={homeHref}>Gå til forsiden</Link>
          </Button>
          {secondaryHref && secondaryLabel && (
            <Button asChild variant='secondary'>
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          )}
          {showBrokenLinkButton && !secondaryHref && !secondaryLabel && (
            <Button asChild variant='secondary'>
              <a href={mailto}>Meld fra om ødelagt lenke</a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
