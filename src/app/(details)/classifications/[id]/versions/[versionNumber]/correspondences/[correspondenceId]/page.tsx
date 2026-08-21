import { Link as DigdirLink } from '@digdir/designsystemet-react';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getRequestLanguage } from '@/app/(details)/classifications/[id]/layout';
import { CorrespondenceTable } from '@/app/(details)/classifications/components/correspondence-table';
import { buildDownloadHref } from '@/app/(details)/classifications/utils/download-urls';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { fetchCorrespondenceTable } from '@/libs/data/classifications/correspondencesData';
import { fetchVersionById } from '@/libs/data/classifications/versionsData';
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

  const downloadHref = buildDownloadHref(
    `/classifications/${id}/versions/${versionNumber}/correspondences/${correspondenceId}`,
    { format: 'csv', language },
  );

  return (
    <main className={styles.page}>
      <DigdirLink asChild>
        <Link href={buildUrl({ classificationId, versionId, tab: 'correspondences' })}>
          <ArrowLeftIcon aria-hidden='true' />
          {localization.codeTree.back}
        </Link>
      </DigdirLink>
      <h1 className={styles.title}>{table.name}</h1>
      <CorrespondenceTable
        sourceName={table.source ?? ''}
        targetName={table.target ?? ''}
        mappings={table.correspondenceMaps ?? []}
        downloadHref={downloadHref}
      />
    </main>
  );
}
