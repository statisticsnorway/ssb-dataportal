import { notFound } from 'next/navigation';
import { fetchClassificationById } from '@/libs/data/classifications/classificationData';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import VersionsView from '../../components/views/VersionsView';

export default async function Versions({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const logger = createLogger('versions-page');
  const { id } = await params;
  const classificationId = Number(id);

  if (Number.isNaN(classificationId)) return notFound();

  // Cached — same fetch as layout
  const classification = await fetchClassificationById(classificationId).catch((error) => {
    logger.error({ id, error: sanitizeError(error) }, 'Failed to load classification');
    return notFound();
  });

  const versions = [...(classification.versions ?? [])].sort(
    (a, b) => (b.validFrom?.getTime() ?? 0) - (a.validFrom?.getTime() ?? 0),
  );

  return <VersionsView classificationId={classificationId} versions={versions} />;
}