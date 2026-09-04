import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { getDataProductByShortName, listDatasetsByProductShortName } from '@/libs/data/datasets/datasets';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import DataProductDetail from './dataProductDetail';

const getPageData = cache(async (shortName: string) => {
  const [dataProduct, datasets] = await Promise.all([
    getDataProductByShortName(shortName),
    listDatasetsByProductShortName(shortName).catch(() => []),
  ]);
  return { dataProduct, datasets };
});

export async function generateMetadata({ params }: { params: Promise<{ shortName: string }> }): Promise<Metadata> {
  const { shortName } = await params;
  const { dataProduct } = await getPageData(shortName).catch(() => ({ dataProduct: null }));
  return { title: dataProduct?.title ?? shortName };
}

export default async function DataProduct({ params }: Readonly<{ params: Promise<{ shortName: string }> }>) {
  const logger = createLogger('data-product-detail-page');

  const { shortName } = await params;
  const { dataProduct, datasets } = await getPageData(shortName).catch((error) => {
    logger.error({ shortName, error: sanitizeError(error) }, 'Failed to load data product details');
    return notFound();
  });

  if (!dataProduct) return notFound();

  return <DataProductDetail dataProduct={dataProduct} datasets={datasets} />;
}
