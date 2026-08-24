import { Link as DigdirLink, Heading } from '@digdir/designsystemet-react';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRequestLanguage } from '@/app/(details)/classifications/[id]/layout';
import { CorrespondenceTable } from '@/app/(details)/classifications/components/correspondence-table';
import { mapCorrespondenceDetails } from '@/app/(details)/classifications/utils/correspondences';
import { buildDownloadHref } from '@/app/(details)/classifications/utils/download-urls';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { DetailsList } from '@/components/details-list';
import { fetchCorrespondenceTable } from '@/libs/data/classifications/correspondencesData';
import { fetchVersionById } from '@/libs/data/classifications/versionsData';
import { CorrespondenceMapResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import styles from './correspondences.module.css';

interface CorrespondencePageProps {
  params: Promise<{
    id: string;
    versionNumber: string;
    correspondenceId: string;
  }>;
}

export default async function CorrespondencePage({ params }: Readonly<CorrespondencePageProps>) {
  const { id, versionNumber, correspondenceId } = await params;

  const classificationId = Number(id);
  const versionId = Number(versionNumber);
  const tableId = Number(correspondenceId);

  if (Number.isNaN(classificationId) || Number.isNaN(versionId) || Number.isNaN(tableId)) {
    return notFound();
  }

  const language = await getRequestLanguage();

  const version = await fetchVersionById(versionId, language);

  if (!version) {
    return notFound();
  }

  const table = await fetchCorrespondenceTable(tableId, language);
  const mappings = table.correspondenceMaps ?? [];

  const downloadHref = buildDownloadHref(
    buildUrl({
      classificationId: Number(id),
      versionId: Number(versionNumber),
      correspondenceId: Number(correspondenceId),
    }),
    { format: 'csv', language },
  );

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

  const codeCounts = {
    source: countDistinctCodes(mappings, 'source'),
    target: countDistinctCodes(mappings, 'target'),
  };

  return (
    <main className={styles.page}>
      <DigdirLink asChild>
        <Link href={buildUrl({ classificationId, versionId, tab: 'correspondences' })}>
          <ArrowLeftIcon aria-hidden='true' />
          {localization.codeTree.back}
        </Link>
      </DigdirLink>
      <h1 className={styles.title}>{table.name}</h1>
      <DetailsList content={mapCorrespondenceDetails(table)} />
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
