import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { getDatasetById, listDataFilesByDatasetId } from '@/libs/data/datasets/datasets';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import DatasetDetail from './datasetDetail';

/**
 * Fetches and caches page data for a variable definition by its short name.
 */
const getPageData = cache(async (id: string) => {
  const dataset = await getDatasetById(id);
  const dataFiles = await listDataFilesByDatasetId(id);
  return { dataset: dataset, dataFiles: dataFiles };
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { dataset } = await getPageData(id).catch(() => ({ dataset: null }));
  return { title: dataset?.short_description ?? id };
}

export default async function Dataset({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const logger = createLogger('dataset-detail-page');
  const { id } = await params;
  logger.info({ id }, 'Dataset detail page access');

  const { dataset, dataFiles } = await getPageData(id).catch((error) => {
    logger.error({ id, error: sanitizeError(error) }, 'Failed to load dataset');
    return notFound();
  });

  return <DatasetDetail dataset={dataset} dataFiles={dataFiles} />;
}
