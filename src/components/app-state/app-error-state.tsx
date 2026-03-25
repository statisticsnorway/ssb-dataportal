'use client';

import { Paragraph } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { localization } from '@/libs/language';
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
  title,
  message,
  statusCode,
  referenceCode,
  onRetry,
  backHref,
  homeHref = '/',
  supportHref,
}: AppErrorStateProps) {
  const errorText = localization.error;
  const resolvedTitle = title ?? errorText.technicalProblemsTitle;
  const resolvedMessage = message ?? errorText.technicalProblemsMessage;
  const actions: AppStateAction[] = [];

  if (onRetry) {
    actions.push({
      kind: 'button',
      label: errorText.reloadPage,
      onClick: onRetry,
      variant: 'primary',
    });
  }

  if (backHref) {
    actions.push({
      kind: 'link',
      label: errorText.goBack,
      href: backHref,
      variant: 'secondary',
    });
  }

  actions.push({
    kind: 'link',
    label: errorText.goHome,
    href: homeHref,
    variant: 'tertiary',
  });

  return (
    <AppState
      title={resolvedTitle}
      message={resolvedMessage}
      titleId='app-error-title'
      statusCode={statusCode}
      referenceCode={referenceCode}
      helpTitle={errorText.helpTitle}
      helpList={[errorText.helpReload, errorText.helpBack, errorText.helpHome]}
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
