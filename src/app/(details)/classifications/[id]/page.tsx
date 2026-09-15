import { redirect } from 'next/navigation';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { createLogger } from '@/libs/logger/server-logger';

export default async function ClassificationPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const logger = createLogger('classification-details-page');
  logger.info({ id }, 'Classification detail page access');
  redirect(buildUrl({ classificationId: Number(id), tab: 'codes' }));
}
