'use client';

import { Paragraph } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { AppState, AppStateAction } from './app-state';
import styles from './app-state.module.css';

type AppErrorStateProps = Readonly<{
  title?: string;
  message?: string;
  statusCode?: string;
  referenceCode?: string;
  onRetry?: () => void;
  backHref?: string;
  homeHref?: string;
  supportHref?: string;
}>;

export function AppErrorState({
  title = 'Vi har tekniske problemer',
  message = 'Dette skyldes ikke noe du gjorde. Vent litt og prøv igjen.',
  statusCode,
  referenceCode,
  onRetry,
  backHref,
  homeHref = '/',
  supportHref,
}: AppErrorStateProps) {
  const actions: AppStateAction[] = [];

  if (onRetry) {
    actions.push({
      kind: 'button',
      label: 'Last siden på nytt',
      onClick: onRetry,
      variant: 'primary',
    });
  }

  if (backHref) {
    actions.push({
      kind: 'link',
      label: 'Gå tilbake',
      href: backHref,
      variant: 'secondary',
    });
  }

  actions.push({
    kind: 'link',
    label: 'Gå til forsiden',
    href: homeHref,
    variant: 'tertiary',
  });

  return (
    <AppState
      title={title}
      message={message}
      titleId='app-error-title'
      statusCode={statusCode}
      referenceCode={referenceCode}
      helpTitle='Du kan prøve å:'
      helpList={['vente litt og laste siden på nytt', 'gå tilbake til forrige side', 'gå til forsiden']}
      actions={actions}
      footer={
        supportHref ? (
          <Paragraph className={styles.help}>
            Har problemet vart en stund, kan du{' '}
            <Link href={supportHref} target='_blank' rel='noopener noreferrer'>
              kontakte oss
            </Link>
            .
          </Paragraph>
        ) : undefined
      }
    />
  );
}
