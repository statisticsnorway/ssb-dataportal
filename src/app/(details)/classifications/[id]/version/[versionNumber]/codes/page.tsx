import { notFound } from 'next/navigation';
import { CodesView } from '@/app/(details)/classifications/components/views/CodesView';
import { fetchVersionCodes } from '@/libs/data/classifications/codesData';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';

export default async function CodesVersion({
  params,
}: Readonly<{ params: Promise<{ id: string; versionNumber: string }> }>) {
  const logger = createLogger('codes-version-page');
  const { id, versionNumber } = await params;
  const versionId = Number(versionNumber);

  if (Number.isNaN(versionId)) return notFound();

  const codes = await fetchVersionCodes(versionId).catch((error) => {
    logger.error({ id, versionNumber, error: sanitizeError(error) }, 'Failed to load version codes');
    return notFound();
  });

  return <CodesView codes={codes} />;
}
