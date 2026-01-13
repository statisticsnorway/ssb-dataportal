'use client';

import { Button } from '@digdir/designsystemet-react';
import { ClipboardCheckmarkIcon, ClipboardIcon } from '@navikt/aksel-icons';
import { useClipboard } from '@/hooks/useClipboard';
import styles from './code-snippet.module.css';

type Props = {
  title?: string;
  code: string;
  copyLabel?: string;
  copiedLabel?: string;
  className?: string;
};

export function CodeSnippet({
  title = 'Python kodeeksempel',
  code,
  copyLabel = 'Kopier kode',
  copiedLabel = 'Kopiert',
  className,
}: Props) {
  const { copied, copyToClipboard } = useClipboard();
  const lines = code.replace(/\n+$/, '').split('\n');

  return (
    <section className={`${styles.snippet} ${className || ''}`}>
      <div className={styles.header}>
        <span>{title}</span>
        <Button
          title={copyLabel}
          className='copyButton'
          icon
          onClick={() => copyToClipboard(code)}
          aria-label={copied ? copiedLabel : copyLabel}
        >
          {copied ? <ClipboardCheckmarkIcon aria-hidden /> : <ClipboardIcon aria-hidden />}
        </Button>
      </div>

      <pre className={styles.pre}>
        <code className={styles.code}>
          {lines.map((line, i) => (
            <span key={`${i}-${line}`} className={styles.line}>
              {line || '\u00A0'}
            </span>
          ))}
        </code>
      </pre>
    </section>
  );
}
