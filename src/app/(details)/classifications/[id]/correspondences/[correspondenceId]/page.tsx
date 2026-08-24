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
import { localization } from '@/libs/language';
import styles from '../../versions/[versionNumber]/correspondences/[correspondenceId]/correspondences.module.css';

export default async function CorrespondencePage({
  params,
}: Readonly<{ params: Promise<{ id: string; correspondenceId: string }> }>) {
  const { id, correspondenceId } = await params;
  const classificationId = Number(id);
  const tableId = Number(correspondenceId);

  if (Number.isNaN(classificationId) || Number.isNaN(tableId)) {
    return notFound();
  }

  const language = await getRequestLanguage();
  const table = await fetchCorrespondenceTable(tableId, language);

  if (!table) {
    return notFound();
  }

  const downloadHref = buildDownloadHref(`/classifications/${id}/correspondences/${correspondenceId}`, {
    format: 'csv',
    language,
  });

  return (
    <main className={styles.page}>
      <DigdirLink asChild>
        <Link href={buildUrl({ classificationId, tab: 'correspondences' })}>
          <ArrowLeftIcon aria-hidden='true' />
          {localization.codeTree.back}
        </Link>
      </DigdirLink>
      <h1 className={styles.title}>{table.name}</h1>
      <DetailsList content={mapCorrespondenceDetails(table)} />
      <Heading className='secondaryHeading' data-size='md' level={2}>
        {localization.classificationDetails.codes}
      </Heading>
      <CorrespondenceTable
        sourceName={table.source ?? ''}
        targetName={table.target ?? ''}
        mappings={table.correspondenceMaps ?? []}
        downloadHref={downloadHref}
      />
    </main>
  );
}
