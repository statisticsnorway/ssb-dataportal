import { Metadata } from 'next';
import { listDataProducts, listDatasets } from '@/libs/data/datasets/datasets';
import { localization } from '@/libs/language';
import { createLogger } from '@/libs/logger/server-logger';
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
  const datasets = await listDatasets().catch(() => []);
  return <DataProductsServicePage dataProducts={dataProducts} datasets={datasets} />;
}
