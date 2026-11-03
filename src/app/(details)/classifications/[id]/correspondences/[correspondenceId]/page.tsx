import { notFound } from 'next/navigation';

import { getResolvedVersion } from '@/app/(details)/classifications/[id]/resolvedVersion';
import CorrespondenceDetailView from '@/app/(details)/classifications/components/views/CorrespondenceDetailView';
import { buildDownloadHref } from '@/app/(details)/classifications/utils/download-urls';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { fetchCorrespondenceTable } from '@/libs/data/classifications/correspondencesData';
import { fetchVersionById } from '@/libs/data/classifications/versionsData';
import { getRequestLanguage } from '@/libs/language/src/getRequestLanguage';

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

  // The correspondence id alone is not enough: without this check any table of
  // any classification or version is reachable through this URL.
  const { defaultVersion } = await getResolvedVersion(classificationId);

  if (!defaultVersion?.id) {
    return notFound();
  }

  const version = await fetchVersionById(defaultVersion.id, language, true);
  const belongsToVersion = version?.correspondenceTables?.some((correspondence) => correspondence.id === tableId);

  if (!version || !belongsToVersion) {
    return notFound();
  }

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
