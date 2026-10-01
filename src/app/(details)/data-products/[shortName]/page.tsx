import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { authenticateUser } from '@/libs/auth/userAuth';
import {
  getDataProductByShortName,
  listDataFilesByDatasetIdAndStorageCategory,
  listDatasetsByProductShortNameAndStorageCategory,
} from '@/libs/data/datasets/datasets';
import { StorageCategory } from '@/libs/data-access/datadoc/models/StorageCategory';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import DataProductDetail from './dataProductDetail';

const getPageData = cache(async (shortName: string, isAuthenticated: boolean) => {
  const [dataProduct, datasetsShared, datasetsProduct] = await Promise.all([
    getDataProductByShortName(shortName),
    listDatasetsByProductShortNameAndStorageCategory(shortName, StorageCategory.SHARED),
    isAuthenticated
      ? listDatasetsByProductShortNameAndStorageCategory(shortName, StorageCategory.PRODUCT)
      : Promise.resolve([]),
  ]);

  return { dataProduct, datasetsShared, datasetsProduct };
});

export async function generateMetadata({ params }: { params: Promise<{ shortName: string }> }): Promise<Metadata> {
  const { shortName } = await params;
  const { dataProduct } = await getPageData(shortName, false).catch(() => ({ dataProduct: null }));
  return { title: dataProduct?.title ?? shortName };
}

export default async function DataProduct({ params }: Readonly<{ params: Promise<{ shortName: string }> }>) {
  const logger = createLogger('data-product-detail-page');
  const { shortName } = await params;
  const auth = await authenticateUser();
  const { dataProduct, datasetsShared, datasetsProduct } = await getPageData(shortName, auth.isAuthenticated).catch(
    (error) => {
      logger.error({ shortName, error: sanitizeError(error) }, 'Failed to load data product details');
      return notFound();
    },
  );

  if (!dataProduct) return notFound();

  if (!auth.isAuthenticated) {
    return (
      <DataProductDetail
        dataProduct={dataProduct}
        datasetsShared={datasetsShared}
        datasetsProduct={[]}
        namingStandardViolationsByDatasetId={{}}
      />
    );
  }

  const datasets = [...datasetsShared, ...datasetsProduct];

  const namingStandardViolationsByDatasetId = Object.fromEntries(
    await Promise.all(
      datasets.map(async (dataset) => {
        if (!dataset.id) return null;
        if (!dataset.has_naming_standard_violations) return [dataset.id, 0] as const;

        try {
          const [sharedDataFiles, productDataFiles] = await Promise.all([
            listDataFilesByDatasetIdAndStorageCategory(dataset.id, StorageCategory.SHARED),
            listDataFilesByDatasetIdAndStorageCategory(dataset.id, StorageCategory.PRODUCT),
          ]);

          const totalViolations = [...sharedDataFiles, ...productDataFiles].reduce(
            (total, dataFile) => total + (dataFile.naming_standard_violations?.length ?? 0),
            0,
          );

          return [dataset.id, totalViolations] as const;
        } catch (error) {
          logger.warn(
            { datasetId: dataset.id, error: sanitizeError(error) },
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
      datasetsShared={datasetsShared}
      datasetsProduct={datasetsProduct}
      namingStandardViolationsByDatasetId={namingStandardViolationsByDatasetId}
    />
  );
}
