'use client';

import { Button } from '@digdir/designsystemet-react';
import { ClipboardCheckmarkIcon, ClipboardIcon } from '@navikt/aksel-icons';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ExternalLink } from '@/components/external-link';
import { useClipboard } from '@/hooks/useClipboard';
import { localization } from '@/libs/language';
import styles from './code-snippet.module.css';

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
    <section className={styles.snippet} data-testid='code-snippet'>
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
          style={vs}
          customStyle={{
            paddingTop: '0.5rem',
            paddingRight: '2.5rem',
            paddingBottom: '0.25rem',
            margin: 0,
          }}
          className={styles.pre}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
      <footer className={styles.footer}>
        {daplaLabVardefUrl && (
          <>
            <ExternalLink linkText='Dapla Lab' href={daplaLabVardefUrl} />
            <span>•</span>
          </>
        )}
        <ExternalLink
          linkText={localization.daplaManual}
          href='https://manual.dapla.ssb.no/statistikkere/vardef-toolbelt.html'
        />
      </footer>
    </section>
  );
}
