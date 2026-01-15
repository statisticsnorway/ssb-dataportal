'use client';

import { Button } from '@digdir/designsystemet-react';
import { ClipboardCheckmarkIcon, ClipboardIcon } from '@navikt/aksel-icons';
import { useClipboard } from '@/hooks/useClipboard';
import styles from './code-snippet.module.css';
import { COPIED_LABEL, COPY_CODE_LABEL, DEFAULT_TITLE } from './constants';

type Props = {
  title?: string;
  code: string[];
  copyLabel?: string;
  copiedLabel?: string;
  className?: string;
};

export function CodeSnippet({
  title = DEFAULT_TITLE,
  code,
  copyLabel = COPY_CODE_LABEL,
  copiedLabel = COPIED_LABEL,
  className,
}: Props) {
  const { copied, copyToClipboard } = useClipboard();
  const codeString = Array.isArray(code) ? code.join('\n') : code;
  return (
    <section className={`${styles.snippet} ${className || ''}`}>
      <div className={styles.header}>
        <span>{title}</span>
        <Button
          title={copyLabel}
          className='copyButton'
          icon
          onClick={() => copyToClipboard(codeString)}
          aria-label={copied ? copiedLabel : copyLabel}
        >
          {copied ? <ClipboardCheckmarkIcon aria-hidden /> : <ClipboardIcon aria-hidden />}
        </Button>
      </div>

      <pre className={styles.pre}>
        <code className={styles.code}>
          {code.map((line, i) => (
            <span key={`${i}-${line}`} className={styles.line}>
              {line || '\u00A0'}
            </span>
          ))}
        </code>
      </pre>
    </section>
  );
}
