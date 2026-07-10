import { notFound } from 'next/navigation';
import VersionsView from '@/app/(details)/classifications/components/views/VersionsView';
import { fetchClassificationById } from '@/libs/data/classifications/classificationData';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';

export default async function Versions({
  params,
}: Readonly<{ params: Promise<{ id: string; versionNumber: string }> }>) {
  const logger = createLogger('all-version-page');
  const { id, versionNumber } = await params;
  const classificationId = Number(id);

  if (Number.isNaN(classificationId)) return notFound();

  const classification = await fetchClassificationById(classificationId).catch((error) => {
    logger.error({ id, error: sanitizeError(error) }, 'Failed to load classification');
    return notFound();
  });

  const versions = [...(classification.versions ?? [])].sort(
    (a, b) => (b.validFrom?.getTime() ?? 0) - (a.validFrom?.getTime() ?? 0),
  );

  logger.info({ id, versionNumber }, 'Versions page loaded');
  return <VersionsView classificationId={classificationId} versions={versions} />;
}
