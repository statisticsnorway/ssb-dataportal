import { notFound } from 'next/navigation';
import { fetchLatestVersionCodes } from '@/libs/data/classifications/codesData';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import { CodesView } from '../../components/views/CodesView';

export default async function Codes({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const logger = createLogger('codes-page');
  const { id } = await params;
  const classificationId = Number(id);

  if (Number.isNaN(classificationId)) return notFound();

  const codes = await fetchLatestVersionCodes(classificationId).catch((error) => {
    logger.error({ id, error: sanitizeError(error) }, 'Failed to load classification codes');
    return notFound();
  });

  return <CodesView codes={codes} />;
}
