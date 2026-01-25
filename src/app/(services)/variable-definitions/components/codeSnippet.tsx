'use client';

import { Button } from '@digdir/designsystemet-react';
import { ClipboardCheckmarkIcon, ClipboardIcon } from '@navikt/aksel-icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useClipboard } from '@/hooks/useClipboard';
import styles from './code-snippet.module.css';

import { COPIED_LABEL, COPY_CODE_LABEL, DAPLA_LAB_VARDEF_URL, VARDEF_DOCUMENTATION_URL } from './constants';

type Props = {
  title?: React.ReactNode;
  code: string[];
  copyLabel?: string;
  copiedLabel?: string;
  className?: string;
};

export function CodeSnippet({
  title,
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

      <SyntaxHighlighter
        language='python'
        style={oneLight}
        customStyle={{
          fontSize: 'clamp(0.8rem, 1.1vw, 1.05rem)',
          lineHeight: 1.5,
          padding: 0,
          margin: 0,
        }}
        className={`codeBlock ${styles.pre}`}
        codeTagProps={{
          className: styles.code,
        }}
      >
        {codeString}
      </SyntaxHighlighter>
      <footer className={styles.footer}>
        <a href={DAPLA_LAB_VARDEF_URL} target='_blank' rel='noopener noreferrer'>
          Dapla Lab
        </a>
        <span className={styles.divider}>•</span>
        <a href={VARDEF_DOCUMENTATION_URL} target='_blank' rel='noopener noreferrer'>
          Dokumentasjon
        </a>
      </footer>
    </section>
  );
}
