import { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { fetchSubjectFieldFilterValues } from '@/libs/data/classifications/codesData';
import { listDataProducts } from '@/libs/data/datasets/datasets';
import { languageCookieName, localization, resolveLanguage } from '@/libs/language';
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
  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const language = resolveLanguage(
    cookieStore.get(languageCookieName)?.value,
    requestHeaders.get('accept-language') ?? undefined,
  );
  const logger = createLogger('data-products-discover-page');
  logger.info({ params }, 'Data products page access');
  const dataProducts = await listDataProducts();
  const subjectFields = await fetchSubjectFieldFilterValues(language);
  return <DataProductsServicePage dataProducts={dataProducts} subjectFields={subjectFields} />;
}
