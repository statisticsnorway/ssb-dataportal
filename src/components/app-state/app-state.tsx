'use client';

import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { ReactNode } from 'react';
import styles from './app-state.module.css';

export type AppStateAction =
  | Readonly<{
      kind: 'link';
      label: string;
      href: string;
      variant?: 'primary' | 'secondary' | 'tertiary';
      external?: boolean;
    }>
  | Readonly<{
      kind: 'button';
      label: string;
      onClick: () => void;
      variant?: 'primary' | 'secondary' | 'tertiary';
    }>;

type AppStateProps = Readonly<{
  title: string;
  message: string;
  titleId: string;
  statusCode?: string;
  referenceCode?: string;
  helpTitle?: string;
  helpList?: readonly string[];
  actions?: readonly AppStateAction[];
  footer?: ReactNode;
}>;

function AppStateActionButton({ action }: Readonly<{ action: AppStateAction }>) {
  const variant = action.variant ?? 'primary';

  if (action.kind === 'button') {
    return (
      <Button type='button' onClick={action.onClick} variant={variant}>
        {action.label}
      </Button>
    );
  }

  if (action.external) {
    return (
      <Button asChild variant={variant}>
        <a href={action.href} target='_blank' rel='noopener noreferrer'>
          {action.label}
        </a>
      </Button>
    );
  }

  return (
    <Button asChild variant={variant}>
      <Link href={action.href}>{action.label}</Link>
    </Button>
  );
}

export function AppState({
  title,
  message,
  titleId,
  statusCode,
  referenceCode,
  helpTitle,
  helpList,
  actions = [],
  footer,
}: AppStateProps) {
  return (
    <section className={styles.wrapper} aria-labelledby={titleId}>
      <div className={styles.content}>
        {(statusCode || referenceCode) && (
          <div className={styles.codeBlock}>
            {statusCode && <Paragraph className={styles.code}>Feilkode: {statusCode}</Paragraph>}
            {referenceCode && <Paragraph className={styles.code}>Referanse: {referenceCode}</Paragraph>}
          </div>
        )}

        <Heading id={titleId} level={1} data-size='lg'>
          {title}
        </Heading>

        <Paragraph className={styles.lead}>{message}</Paragraph>

        {helpList && helpList.length > 0 && (
          <div className={styles.help}>
            {helpTitle && <Paragraph>{helpTitle}</Paragraph>}
            <ul className={styles.helpList}>
              {helpList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {actions.length > 0 && (
          <div className={styles.actions}>
            {actions.map((action) => {
              const key =
                action.kind === 'link'
                  ? `${action.kind}-${action.href}-${action.label}`
                  : `${action.kind}-${action.label}`;

              return <AppStateActionButton key={key} action={action} />;
            })}
          </div>
        )}

        {footer}
      </div>
    </section>
  );
}
