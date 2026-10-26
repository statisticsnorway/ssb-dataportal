import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { getDatasetById, listDataFilesByDatasetIdAndStorageCategory, listVariablesByDataset } from '@/libs/data/datasets/datasets';
import { StorageCategory } from '@/libs/data-access/datadoc';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import DatasetDetail from './datasetDetail';

/**
 * Fetches and caches page data for a variable definition by its short name.
 */
const getPageData = cache(async (id: string, isAuthenticated: boolean) => {
  const dataset = await getDatasetById(id);
  const variables = await listVariablesByDataset(id);
  const dataFilesShared = await listDataFilesByDatasetIdAndStorageCategory(id, StorageCategory.SHARED);
  const dataFilesProduct = isAuthenticated
    ? await listDataFilesByDatasetIdAndStorageCategory(id, StorageCategory.PRODUCT)
    : [];

  return { dataset, dataFilesShared, dataFilesProduct, variables };
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { dataset } = await getPageData(id, false).catch(() => ({ dataset: null }));
  return { title: dataset?.short_description ?? id };
}

export default async function Dataset({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const logger = createLogger('dataset-detail-page');
  const { id } = await params;
  logger.info({ id }, 'Dataset detail page access');

  const { dataset, dataFilesShared, dataFilesProduct, variables } = await getPageData(id, true).catch((error) => {
    logger.error({ id, error: sanitizeError(error) }, 'Failed to load dataset');
    return notFound();
  });

  return <DatasetDetail variables={variables} dataset={dataset} dataFilesShared={dataFilesShared} dataFilesProduct={dataFilesProduct} />;
}
