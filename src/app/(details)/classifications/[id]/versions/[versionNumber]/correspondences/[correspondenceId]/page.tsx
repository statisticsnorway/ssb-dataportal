import { notFound } from 'next/navigation';

import { getRequestLanguage } from '@/app/(details)/classifications/[id]/layout';
import CorrespondenceDetailView from '@/app/(details)/classifications/components/views/CorrespondenceDetailView';
import { buildDownloadHref } from '@/app/(details)/classifications/utils/download-urls';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { fetchCorrespondenceTable } from '@/libs/data/classifications/correspondencesData';
import { fetchVersionById } from '@/libs/data/classifications/versionsData';

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

  if (!table) {
    return notFound();
  }

  const downloadHref = buildDownloadHref(
    `/classifications/${id}/versions/${versionNumber}/correspondences/${correspondenceId}`,
    { format: 'csv', language },
  );

  return (
    <CorrespondenceDetailView
      table={table}
      backHref={buildUrl({ classificationId, versionId, tab: 'correspondences' })}
      downloadHref={downloadHref}
    />
  );
}
