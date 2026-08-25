import { Link as DigdirLink, Heading } from '@digdir/designsystemet-react';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import Link from 'next/link';
import { DetailsList } from '@/components/details-list';
import { CorrespondenceMapResource, CorrespondenceTableResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import { mapCorrespondenceDetails } from '../../utils/correspondences';
import { CorrespondenceTable } from '../correspondence-table';
import styles from './views.module.css';

function countDistinctCodes(mappings: CorrespondenceMapResource[], side: 'source' | 'target'): number {
  const codes = new Set<string>();

  for (const mapping of mappings) {
    const code = side === 'source' ? mapping.sourceCode : mapping.targetCode;
    if (code?.trim()) {
      codes.add(code.trim());
    }
  }

  return codes.size;
}

interface CorrespondenceDetailViewProps {
  table: CorrespondenceTableResource;
  backHref: string;
  downloadHref: string;
}

export default function CorrespondenceDetailView({
  table,
  backHref,
  downloadHref,
}: Readonly<CorrespondenceDetailViewProps>) {
  const mappings = table.correspondenceMaps ?? [];
  const codeCounts = {
    source: countDistinctCodes(mappings, 'source'),
    target: countDistinctCodes(mappings, 'target'),
  };
  return (
    <main className={styles.detailPage}>
      <DigdirLink asChild>
        <Link href={backHref}>
          <ArrowLeftIcon aria-hidden='true' />
          {localization.codeTree.back}
        </Link>
      </DigdirLink>
      <h1 className={styles.detailsHeading}>{table.name}</h1>
      <DetailsList content={mapCorrespondenceDetails(table)} />
      <br />
      <Heading className='secondaryHeading' data-size='md' level={2}>
        {localization.classificationDetails.codes}
      </Heading>
      <p className={styles.codeSummary}>
        {localization.formatString(localization.classification.correspondence.codeSummary, {
          sourceCount: codeCounts.source,
          sourceName: table.source?.trim() || '',
          targetCount: codeCounts.target,
          targetName: table.target?.trim() || '',
        })}
      </p>
      <CorrespondenceTable
        sourceName={table.source ?? ''}
        targetName={table.target ?? ''}
        mappings={table.correspondenceMaps ?? []}
        downloadHref={downloadHref}
      />
    </main>
  );
}
