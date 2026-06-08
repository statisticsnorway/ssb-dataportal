import { Metadata } from 'next';
import { listDataProducts, listDatasets } from '@/libs/data/datasets/datasets';
import { localization } from '@/libs/language';
import { createLogger } from '@/libs/logger/server-logger';
import { fetchStaticSubjectFields } from '@/utils/mock-data';
import { DataProductsServicePage } from './data-products-service-page';

export const metadata: Metadata = {
  title: localization.pageTitle.dataProducts,
};

export default async function Datasets({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const params = await searchParams;
  const logger = createLogger('data-products-discover-page');
  logger.info({ params }, 'Data products page access');
  const dataProducts = await listDataProducts();
  const subjectFields = await fetchStaticSubjectFields();
  const datasets = await listDatasets().catch((error) => {
    logger.error({ error }, 'Failed to list datasets');
    return [];
  });
  return <DataProductsServicePage dataProducts={dataProducts} datasets={datasets} subjectFields={subjectFields} />;
}
