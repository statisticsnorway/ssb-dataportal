import { Metadata } from 'next';
import { listDataProducts } from '@/libs/data/datasets/datasets';
import { localization } from '@/libs/language';
import { createLogger } from '@/libs/logger/server-logger';
import { fetchStaticSubjectFields } from '@/utils/mock-data';
import { DataProductsServicePage } from './data-products-service-page';

export const metadata: Metadata = {
  title: localization.pageTitle.dataProducts,
};

export const revalidate = 3600;

export default async function DataProducts() {
  const logger = createLogger('data-products-discover-page');
  logger.info('Data products page access');
  const dataProducts = await listDataProducts();
  const subjectFields = await fetchStaticSubjectFields();
  return <DataProductsServicePage dataProducts={dataProducts} subjectFields={subjectFields} />;
}
