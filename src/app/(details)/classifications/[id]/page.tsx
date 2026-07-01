import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { fetchClassificationById } from '@/libs/data/classifications/classificationData';
import { ClassificationResource } from '@/libs/data-access/klass';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import ClassificationDetail from './classificationDetail';

const getPageData = cache(async (id: number) => {
  const logger = createLogger('classification-detail-page');
  let classification: ClassificationResource | undefined = undefined;

  if (classification === undefined) {
    classification = await fetchClassificationById(id);
    logger.debug(`Fetched classification ${classification.name}`);
  }
  return { classification };
});

export async function generateMetadata({ params }: { params: Promise<{ id: number }> }): Promise<Metadata> {
  const { id } = await params;
  const { classification } = await getPageData(Number(id)).catch(() => ({ classification: null }));
  const classificationId = String(id);
  return { title: classification?.name ?? classificationId };
}

export default async function Classification({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const logger = createLogger('classification-detail-page');
  const { id } = await params;
  const { classification } = await getPageData(Number(id)).catch((error) => {
    logger.error({ id, error: sanitizeError(error) }, 'Failed to load classification details');
    return notFound();
  });

  logger.info({ id }, 'Classification detail page access');

  return <ClassificationDetail classification={classification} />;
}
