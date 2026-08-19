import { redirect } from 'next/navigation';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { createLogger } from '@/libs/logger/server-logger';

export default async function ClassificationPage({
  params,
}: Readonly<{ params: Promise<{ id: string; versionNumber: string }> }>) {
  const { id, versionNumber } = await params;
  const logger = createLogger('classification-details-page');
  logger.info({ id, versionNumber }, 'Classification detail version page access');
  redirect(buildUrl({ classificationId: Number(id), versionId: Number(versionNumber), tab: 'codes' }));
}
