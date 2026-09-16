import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { authenticateUser } from '@/libs/auth/userAuth';
import {
  getDataProductByShortName,
  listDataFilesByDatasetId,
  listDatasetsByProductShortName,
} from '@/libs/data/datasets/datasets';
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

  const auth = await authenticateUser();

  if (!auth.isAuthenticated) {
    return <DataProductDetail dataProduct={dataProduct} datasets={datasets} namingStandardViolationsByDatasetId={{}} />;
  }

  const namingStandardViolationsByDatasetId = Object.fromEntries(
    await Promise.all(
      datasets.map(async (dataset) => {
        if (!dataset.id) {
          return null;
        }

        if (!dataset.has_naming_standard_violations) {
          return [dataset.id, 0] as const;
        }

        try {
          const dataFiles = await listDataFilesByDatasetId(dataset.id);
          const totalViolations = dataFiles.reduce(
            (total, dataFile) => total + (dataFile.naming_standard_violations?.length ?? 0),
            0,
          );
          return [dataset.id, totalViolations] as const;
        } catch (error) {
          logger.warn(
            {
              datasetId: dataset.id,
              error: sanitizeError(error),
            },
            'Failed to load naming standard violations for dataset',
          );
          return [dataset.id, 0] as const;
        }
      }),
    ).then((entries) => entries.filter((entry): entry is readonly [string, number] => entry !== null)),
  );

  return (
    <DataProductDetail
      dataProduct={dataProduct}
      datasets={datasets}
      namingStandardViolationsByDatasetId={namingStandardViolationsByDatasetId}
    />
  );
}
