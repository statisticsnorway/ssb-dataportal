'use client';

import { Button } from '@digdir/designsystemet-react';
import { ClipboardCheckmarkIcon, ClipboardIcon } from '@navikt/aksel-icons';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useClipboard } from '@/hooks/useClipboard';
import { localization } from '@/libs/language';
import styles from './code-snippet.module.css';

//TODO: The color green in codeString fails contrast checks and should be replaced by SSB green #00824d
//TODO: Use variable for green-color in global.css :root section
type Props = {
  title?: React.ReactNode;
  code: string[];
  copyLabel?: string;
  copiedLabel?: string;
  daplaLabVardefUrl: string | undefined;
};

export function CodeSnippet({
  title,
  code,
  copyLabel = localization.copy.code,
  copiedLabel = localization.copy.copied,
  daplaLabVardefUrl,
}: Props) {
  const { copied, copyToClipboard } = useClipboard();
  const codeString = Array.isArray(code) ? code.join('\n') : code;
  return (
    <section className={styles.snippet}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
      </div>
      <div className={styles.codeWrapper}>
        <Button
          title={copyLabel}
          className={styles.copyCodeButton}
          variant='tertiary'
          icon
          onClick={() => copyToClipboard(codeString)}
          aria-label={copied ? copiedLabel : copyLabel}
        >
          {copied ? <ClipboardCheckmarkIcon aria-hidden /> : <ClipboardIcon aria-hidden />}
        </Button>
        <SyntaxHighlighter
          language='python'
          style={oneLight}
          customStyle={{
            paddingTop: '0.5rem',
            paddingRight: '2.5rem',
            paddingBottom: '0.25rem',
            margin: 0,
          }}
          className={styles.pre}
          codeTagProps={{
            className: styles.code,
          }}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
      <footer className={styles.footer}>
        {daplaLabVardefUrl && (
          <>
            <a href={daplaLabVardefUrl} target='_blank' rel='noopener noreferrer'>
              Dapla Lab
            </a>
            <span className={styles.divider}>•</span>
          </>
        )}
        <a href='https://manual.dapla.ssb.no/statistikkere/vardef.html' target='_blank' rel='noopener noreferrer'>
          {localization.documentation}
        </a>
      </footer>
    </section>
  );
}
