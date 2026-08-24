import { notFound } from 'next/navigation';

import { getRequestLanguage } from '@/app/(details)/classifications/[id]/layout';
import CorrespondenceDetailView from '@/app/(details)/classifications/components/views/CorrespondenceDetailView';
import { buildDownloadHref } from '@/app/(details)/classifications/utils/download-urls';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { fetchCorrespondenceTable } from '@/libs/data/classifications/correspondencesData';

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
    <CorrespondenceDetailView
      table={table}
      backHref={buildUrl({ classificationId, tab: 'correspondences' })}
      downloadHref={downloadHref}
    />
  );
}
