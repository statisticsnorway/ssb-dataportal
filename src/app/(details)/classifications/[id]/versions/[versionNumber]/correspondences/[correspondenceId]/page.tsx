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

  if (
    !Number.isInteger(classificationId) ||
    classificationId <= 0 ||
    !Number.isInteger(versionId) ||
    versionId <= 0 ||
    !Number.isInteger(tableId) ||
    tableId <= 0
  ) {
    return notFound();
  }

  const language = await getRequestLanguage();

  const version = await fetchVersionById(versionId, language);

  const belongsToVersion = version?.correspondenceTables?.some((summary) => summary.id === tableId);

  if (!version || !belongsToVersion) {
    return notFound();
  }

  const table = await fetchCorrespondenceTable(tableId, language);

  if (table?.id !== tableId) {
    return notFound();
  }

  const downloadHref = buildDownloadHref(
    `/classifications/${id}/versions/${versionNumber}/correspondences/${correspondenceId}`,
    { format: 'csv', language },
  );

  return (
    <section className={styles.page} aria-labelledby='correspondence-title'>
      <DigdirLink asChild>
        <Link href={buildUrl({ classificationId, versionId, tab: 'correspondences' })}>
          <ArrowLeftIcon aria-hidden='true' />
          {localization.codeTree.back}
        </Link>
      </DigdirLink>
      <Heading id='correspondence-title' className={`${styles.title} secondaryHeading`} data-size='lg' level={3}>
        {table.name}
      </Heading>
      <DetailsList content={mapCorrespondenceDetails(table)} />
      <Heading className='secondaryHeading' data-size='md' level={4}>
        {localization.classificationDetails.codes}
      </Heading>
      <CorrespondenceTable
        sourceName={table.source ?? ''}
        targetName={table.target ?? ''}
        mappings={table.correspondenceMaps ?? []}
        downloadHref={downloadHref}
      />
    </section>
  );
}
