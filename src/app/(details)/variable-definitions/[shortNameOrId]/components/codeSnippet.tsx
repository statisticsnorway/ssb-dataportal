'use client';

import { Button, Paragraph, Tooltip } from '@digdir/designsystemet-react';
import { FilesIcon } from '@navikt/aksel-icons';
import dynamic from 'next/dynamic';
import { coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { DetailsCard } from '@/components/details-list/detailsCard';
import { ExternalLink } from '@/components/link-components/externalLink';
import { useClipboard } from '@/hooks/useClipboard';
import { localization } from '@/libs/language';
import styles from './code-snippet.module.css';

const SyntaxHighlighter = dynamic(() => import('react-syntax-highlighter').then((mod) => mod.Prism), { ssr: false });

const codeStyle = {
  ...coldarkCold,
  string: {
    ...coldarkCold.string,
    color: '#491FD6',
  },
  char: {
    ...coldarkCold.char,
    color: '#491FD6',
  },
};

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
  const daplaManualUrl = process.env.NEXT_PUBLIC_DAPLA_MANUAL_URL;
  const pyPiPackageUrl = process.env.NEXT_PUBLIC_DAPLA_METADATA_PYPI;
  return (
    <DetailsCard title={localization.codeSnippet.codeExample} headingId='tableHeading-code'>
      {pyPiPackageUrl && (
        <Paragraph className={styles.helpText}>
          {localization.codeSnippet.getVariableDefinition}{' '}
          <ExternalLink linkText={localization.codeSnippet.linkToPyPiPackage} href={pyPiPackageUrl} />
        </Paragraph>
      )}
      <div className={styles.codeBlock}>
        <Tooltip content={copied ? copiedLabel : copyLabel}>
          <Button
            className={styles.copyCodeButton}
            variant='tertiary'
            icon
            onClick={() => copyToClipboard(codeString)}
            aria-label={copied ? copiedLabel : copyLabel}
          >
            <FilesIcon aria-hidden focusable='false' />
          </Button>
        </Tooltip>
        <SyntaxHighlighter
          language='python'
          style={codeStyle}
          customStyle={{
            fontSize: 'calc(0.9rem + 0.25vw)',
            margin: 0,
            padding: '1.5rem',
          }}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
      <footer className={styles.linkFooter}>
        {daplaLabVardefUrl && (
          <ExternalLink
            className='ds-button'
            data-variant='secondary'
            linkText={localization.codeSnippet.daplaLab}
            href={daplaLabVardefUrl}
          />
        )}
        {daplaManualUrl && (
          <ExternalLink
            className='ds-button'
            data-variant='secondary'
            linkText={localization.codeSnippet.daplaManual}
            href={daplaManualUrl}
          />
        )}
      </footer>
    </DetailsCard>
  );
};

export { CodeSnippet };
