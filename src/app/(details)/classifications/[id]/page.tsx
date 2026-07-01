import { redirect } from 'next/navigation';
import { createLogger } from '@/libs/logger/server-logger';

export default async function ClassificationPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const logger = createLogger('classification-details-page');
  logger.info({ id }, 'Classification detail page access');
  redirect(`/classifications/${id}/codes`);
}
