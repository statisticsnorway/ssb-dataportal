'use client';

import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import Link from 'next/link';
import styles from './app-state.module.css';

type AppErrorStateProps = Readonly<{
  title?: string;
  message?: string;
  onRetry?: () => void;
  backHref?: string;
  homeHref?: string;
  supportHref?: string;
}>;

export function AppErrorState({
  title = 'Vi har tekniske problemer',
  message = 'Dette skyldes ikke noe du gjorde. Vent litt og prøv igjen.',
  onRetry,
  backHref,
  homeHref = '/',
  supportHref,
}: AppErrorStateProps) {
  return (
    <section className={styles.wrapper} aria-labelledby='app-error-title'>
      <div className={styles.content}>
        <Heading id='app-error-title' level={1} data-size='lg'>
          {title}
        </Heading>
        <Paragraph className={styles.lead}>{message}</Paragraph>
        <div className={styles.help}>
          <Paragraph>Du kan prøve å:</Paragraph>
          <ul className={styles.helpList}>
            <li>vente litt og laste siden på nytt</li>
            <li>gå tilbake til forrige side</li>
            <li>gå til forsiden</li>
          </ul>
        </div>
        <div className={styles.actions}>
          {onRetry && (
            <Button type='button' onClick={onRetry}>
              Last siden på nytt
            </Button>
          )}
          {backHref && (
            <Button asChild variant='secondary'>
              <Link href={backHref}>Gå tilbake</Link>
            </Button>
          )}
          <Button asChild variant='tertiary'>
            <Link href={homeHref}>Gå til forsiden</Link>
          </Button>
        </div>
        {supportHref && (
          <Paragraph className={styles.help}>
            Har problemet vart en stund, kan du{' '}
            <Link href={supportHref} target='_blank' rel='noopener noreferrer'>
              kontakte oss
            </Link>
            .
          </Paragraph>
        )}
      </div>
    </section>
  );
}
