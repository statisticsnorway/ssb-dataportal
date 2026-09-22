import { Metadata } from 'next';
import { fetchSubjectFieldFilterValues } from '@/libs/data/classifications/codesData';
import { listDataProducts } from '@/libs/data/datasets/datasets';
import { localization } from '@/libs/language';
import { getRequestLanguage } from '@/libs/language/src/getRequestLanguage';
import { createLogger } from '@/libs/logger/server-logger';
import { DataProductsServicePage } from './data-products-service-page';

export const metadata: Metadata = {
  title: localization.pageTitle.dataProducts,
};

export default async function DataProducts({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const params = await searchParams;
  const language = await getRequestLanguage();
  const logger = createLogger('data-products-discover-page');
  logger.info({ params }, 'Data products page access');
  const dataProducts = await listDataProducts();
  const subjectFields = await fetchSubjectFieldFilterValues(language);
  return <DataProductsServicePage dataProducts={dataProducts} subjectFields={subjectFields} />;
}
