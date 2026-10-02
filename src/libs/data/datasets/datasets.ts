'use server';

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getM2mToken } from '@/libs/auth/m2m';
import {
  Configuration,
  ConfigurationParameters,
  DaplaDataFileDTO,
  DaplaDataFileDTOFromJSON,
  DataFilesApi,
  DataFilesApiInterface,
  DataProductDTO,
  DataProductDTOFromJSON,
  DataProductsApi,
  DataProductsApiInterface,
  DatasetDTO,
  DatasetDTOFromJSON,
  DatasetsApi,
  DatasetsApiInterface,
  ResponseError,
  StorageCategory,
} from '@/libs/data-access/datadoc';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger, createLoggerWithBindings } from '@/libs/logger/server-logger';
import dataProductsStatic from '@/static-data/data-products.json';
import datasetsStatic from '@/static-data/datasets.json';
import { getUserAgent } from '@/utils/userAgent';
import { getEncodedJwt } from '../../auth/jwt';

const staticDataProducts = dataProductsStatic.map((dataProduct) => DataProductDTOFromJSON(dataProduct));
const staticDatasets = datasetsStatic.map((dataset) => DatasetDTOFromJSON(dataset));

const ttlSeconds = Number(process.env.DATADOC_CACHE_TTL_SECONDS) || 3600;
const dataDocFetchOptions = {
  cache: 'force-cache',
  next: { revalidate: ttlSeconds },
} as const;

type Apis = DataProductsApiInterface | DatasetsApiInterface | DataFilesApiInterface;
type Logger = ReturnType<typeof createLogger>;

function logAndThrowFetchError(logger: Logger, error: unknown): never {
  if (error instanceof ResponseError) {
    logger.error({ statusCode: error.response.status, url: error.response.url }, 'API request failed');
  } else {
    logger.error({ error }, 'Unexpected error during fetch');
  }
  throw error;
}

export async function getClientForApi<T extends Apis>(api: new (configuration: Configuration) => T): Promise<T> {
  const logger = createLogger('data-products');
  let token = process.env.SSB_DATAPORTAL_JWT_TOKEN;
  if (token) {
    logger.warn('Using hardcoded access token from environment! (SSB_DATAPORTAL_JWT_TOKEN)');
  } else if (process.env.DATADOC_USE_M2M_TOKEN === 'true') {
    logger.info('Using M2M token for DataDoc auth');
    token = await getM2mToken(process.env.DATADOC_M2M_CLIENT_ID, process.env.DATADOC_M2M_CLIENT_SECRET);
  } else {
    token = await getEncodedJwt().catch((reason) => {
      logger.error({ error: sanitizeError(reason) }, 'JWT retrieval unexpectedly failed');
      return undefined;
    });
    if (!token) {
      logger.error('No JWT token found in request headers and M2M is disabled');
      throw new Error('Could not retrieve access token!');
    }
    logger.debug('Successfully retrieved JWT from authorization header');
  }
  let configParams = {
    accessToken: token,
    headers: {
      'User-Agent': getUserAgent(),
    },
  } as ConfigurationParameters;
  const basePath = process.env.METADATA_API_BASE_PATH;
  if (basePath) {
    logger.debug({ basePath }, 'DataDoc API base path configured');
    configParams.basePath = basePath;
  }
  return new api(new Configuration(configParams));
}

/**
 * Used in the data products module to fetch the list of data products from the API or static data.
 * @returns A promise that resolves to an array of DataProductDTO objects representing the available data products.
 */
async function listDataProducts(): Promise<DataProductDTO[]> {
  const logger = createLogger('data-products');
  logger.info('List Data Products');
  if (process.env.DATADOC_USE_STATIC_DATA === 'true') {
    logger.warn({ fn: 'listDataProducts' }, 'Using static mock data for data products');
    return staticDataProducts;
  }
  try {
    logger.info('Getting from api');
    const api = await getClientForApi(DataProductsApi);
    const startTime = Date.now();
    const rawData = await api.listDataProducts({}, dataDocFetchOptions);
    const durationMs = Date.now() - startTime;
    if (rawData.length > 0) {
      logger.debug({ firstProduct: rawData[0] }, 'Fetched data products');
    }
    logger.info({ count: rawData.length, durationMs }, 'Fetched data products from API');
    return rawData;
  } catch (error: unknown) {
    logAndThrowFetchError(logger, error);
  }
}

/**
 * Fetches a data product by its short name.
 * @param shortName The short name of the data product to fetch.
 * @returns A promise that resolves to a DataProductDTO object representing the fetched data product.
 */
export async function getDataProductByShortName(shortName: string): Promise<DataProductDTO> {
  const logger = createLogger('data-products');
  if (process.env.DATADOC_USE_STATIC_DATA === 'true') {
    logger.warn({ fn: 'getDataProductByShortName' }, 'Using static mock data for data products');
    const dataProduct = staticDataProducts.find((d) => d.product_short_name === shortName);
    if (!dataProduct) throw new ResponseError(new Response(null, { status: 404 }), 'Not found');
    return dataProduct;
  }
  try {
    const api = await getClientForApi(DataProductsApi);
    const dto = await api.getDataProductByShortName({ shortName });
    logger.info({ shortName }, 'Fetched data product');
    return dto;
  } catch (error: unknown) {
    logAndThrowFetchError(logger, error);
  }
}

/**
 * Fetches the list of datasets for a given data product and storage category.
 * @param shortName The short name of the data product.
 * @param storageCategory The storage category of the datasets to fetch.
 * @returns A promise that resolves to an array of DatasetDTO objects representing the fetched datasets.
 */
export async function listDatasetsByProductShortNameAndStorageCategory(
  shortName: string,
  storageCategory: StorageCategory,
  options?: { logErrors?: boolean },
): Promise<DatasetDTO[]> {
  const logger = createLogger('datasets');
  logger.info({ shortName, storageCategory }, 'List datasets for product and storage category');

  if (process.env.DATADOC_USE_STATIC_DATA === 'true') {
    logger.warn({ fn: 'listDatasetsByProductShortNameAndStorageCategory' }, 'Using static mock data for datasets');
    return staticDatasets.filter(
      (dataset) => dataset.product_short_name === shortName && dataset.storage_category === storageCategory,
    );
  }

  try {
    const api = await getClientForApi(DatasetsApi);
    const startTime = Date.now();
    const rawData = await api.listDatasets({ productShortName: shortName, storageCategory }, dataDocFetchOptions);

    logger.info(
      { shortName, storageCategory, count: rawData.length, durationMs: Date.now() - startTime },
      'Fetched datasets from API by storage category',
    );

    return rawData;
  } catch (error: unknown) {
    if (options?.logErrors !== false) {
      logAndThrowFetchError(logger, error);
    }

    throw error;
  }
}

/**
 * Fetches the list of data files for a given dataset and storage category.
 * @param datasetId The ID of the dataset.
 * @param storageCategory The storage category of the data files to fetch.
 * @returns A promise that resolves to an array of DaplaDataFileDTO objects representing the fetched data files.
 */
export async function listDataFilesByDatasetIdAndStorageCategory(
  datasetId: string,
  storageCategory: StorageCategory,
): Promise<Array<DaplaDataFileDTO>> {
  const logger = createLoggerWithBindings({
    module: 'datasets',
    fn: 'listDataFilesByDatasetIdAndStorageCategory',
    datasetId,
    storageCategory,
  });

  if (process.env.DATADOC_USE_STATIC_DATA === 'true') {
    logger.warn({ fn: 'listDataFilesByDatasetIdAndStorageCategory' }, 'Using static mock data for data files');
    const datafilePath = join(process.cwd(), 'src', 'static-data', 'data-files', `${datasetId}.json`);
    try {
      const rawData = await readFile(datafilePath, 'utf-8');
      const parsedData = JSON.parse(rawData) as unknown;
      if (!Array.isArray(parsedData)) {
        logger.warn({ datafilePath }, 'Static datafile is not an array');
        return [];
      }
      return parsedData
        .map((item) => DaplaDataFileDTOFromJSON(item))
        .filter((dataFile) => dataFile.storage_category === storageCategory);
    } catch (error: unknown) {
      logger.warn({ error: sanitizeError(error), datafilePath }, 'No static datafile found for dataset id');
      return [];
    }
  }

  try {
    const api = await getClientForApi(DataFilesApi);
    const dto = await api.listDataFiles({ datasetId, storageCategory }, dataDocFetchOptions);
    logger.info({ storageCategory, count: dto.length }, 'Fetched data files from API by storage category');
    return dto;
  } catch (error: unknown) {
    logAndThrowFetchError(logger, error);
  }
}

/**
 * Fetches a dataset by its ID.
 * @param id The ID of the dataset to fetch.
 * @returns A promise that resolves to a DatasetDTO object representing the fetched dataset.
 */
export async function getDatasetById(id: string): Promise<DatasetDTO> {
  const logger = createLoggerWithBindings({ module: 'datasets', fn: 'getDatasetById', id: id });
  if (process.env.DATADOC_USE_STATIC_DATA === 'true') {
    logger.warn({ fn: 'getDatasetById' }, 'Using static mock data for datasets');
    let dataset = staticDatasets.find((dataset) => dataset.id === id);
    if (!dataset) throw new ResponseError(new Response(null, { status: 404 }));
    return dataset;
  }
  try {
    const api = await getClientForApi(DatasetsApi);
    const dto = await api.getDatasetById({ id: id });
    logger.info('Fetched Dataset');
    return dto;
  } catch (error: unknown) {
    logAndThrowFetchError(logger, error);
  }
}

/**
 * Fetches the list of data products that have available datasets.
 * @param isAuthenticated A boolean indicating whether the user is authenticated.
 * @returns A promise that resolves to an array of DataProductDTO objects representing the data products with available datasets.
 */
export async function listDataProductsWithAvailableDatasets(isAuthenticated: boolean): Promise<DataProductDTO[]> {
  const logger = createLogger('datasets');
  const dataProducts = await listDataProducts();

  const products = await Promise.all(
    dataProducts.map(async (dataProduct) => {
      const shortName = dataProduct.product_short_name;
      if (!shortName) return null;

      const [sharedResult] = await Promise.allSettled([
        listDatasetsByProductShortNameAndStorageCategory(shortName, StorageCategory.SHARED, {
          logErrors: false,
        }),
      ]);

      const datasetsShared = sharedResult?.status === 'fulfilled' ? sharedResult.value : [];
      const sharedFailed = sharedResult?.status === 'rejected' ? 1 : 0;

      if (datasetsShared.length > 0 || !isAuthenticated) {
        return {
          dataProduct,
          datasetsShared,
          datasetsProduct: [],
          failedRequests: sharedFailed,
        };
      }

      const [productResult] = await Promise.allSettled([
        listDatasetsByProductShortNameAndStorageCategory(shortName, StorageCategory.PRODUCT, {
          logErrors: false,
        }),
      ]);

      const datasetsProduct = productResult?.status === 'fulfilled' ? productResult.value : [];
      const productFailed = productResult?.status === 'rejected' ? 1 : 0;

      return {
        dataProduct,
        datasetsShared,
        datasetsProduct,
        failedRequests: sharedFailed + productFailed,
      };
    }),
  );

  const failedRequests = products.reduce((count, product) => count + (product?.failedRequests ?? 0), 0);

  if (failedRequests > 0) {
    logger.warn({ failedRequests }, 'Some dataset requests failed while listing data products');
  }

  return products
    .filter(
      (product): product is NonNullable<typeof product> =>
        product !== null && (product.datasetsShared.length > 0 || product.datasetsProduct.length > 0),
    )
    .map((product) => product.dataProduct);
}
