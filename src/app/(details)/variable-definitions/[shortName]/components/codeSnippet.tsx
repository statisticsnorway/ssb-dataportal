'use client';

import { Button, Card, Divider, Heading, Paragraph, Tooltip } from '@digdir/designsystemet-react';
import { ClipboardCheckmarkIcon, ClipboardIcon } from '@navikt/aksel-icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ExternalLink } from '@/components/link-components/externalLink';
import { useClipboard } from '@/hooks/useClipboard';
import { localization } from '@/libs/language';
import styles from './code-snippet.module.css';

export interface CodeSnippetProps {
  code: string[];
  copyLabel?: string;
  copiedLabel?: string;
  daplaLabVardefUrl: string | undefined;
}

const CodeSnippet = ({
  code,
  copyLabel = localization.copy.code,
  copiedLabel = localization.copy.copied,
  daplaLabVardefUrl,
}: CodeSnippetProps) => {
  const { copied, copyToClipboard } = useClipboard();
  const codeString = Array.isArray(code) ? code.join('\n') : code;
  return (
    <Card>
      <Heading className={`${styles.header}`} id={`tableHeading-code`} data-size='md' level={2}>
        {localization.codeSnippet.codeExample}
      </Heading>
      <Paragraph className={styles.helpText}>{localization.codeSnippet.helpText}</Paragraph>
      <Card.Block>
        <Tooltip content={copied ? copiedLabel : copyLabel}>
          <Button
            className={styles.copyCodeButton}
            variant='tertiary'
            icon
            onClick={() => copyToClipboard(codeString)}
            aria-label={copied ? copiedLabel : copyLabel}
          >
            {copied ? <ClipboardCheckmarkIcon aria-hidden /> : <ClipboardIcon aria-hidden />}
          </Button>
        </Tooltip>
        <SyntaxHighlighter
          language='python'
          style={coldarkCold}
          customStyle={{
            borderRadius: '5px',
            fontSize: 'calc(0.9rem + 0.25vw)',
            margin: 0,
            padding: '1rem 3rem 1rem 2rem',
          }}
        >
          {codeString}
        </SyntaxHighlighter>
      </Card.Block>
      <Divider />
      <footer className={styles.linkFooter}>
        {daplaLabVardefUrl && (
          <Button variant='secondary'>
            <ExternalLink linkText='Dapla Lab' href={daplaLabVardefUrl} />
          </Button>
        )}
        <Button variant='secondary'>
          <ExternalLink
            linkText={localization.codeSnippet.daplaManual}
            href='https://manual.dapla.ssb.no/statistikkere/vardef-toolbelt.html'
          />
        </Button>
        <Button variant='secondary'>
          <ExternalLink
            linkText={localization.codeSnippet.linkToPyPiPackage}
            href='https://pypi.org/project/dapla-toolbelt-metadata/'
          />
        </Button>
      </footer>
    </Card>
  );
};

export { CodeSnippet };
