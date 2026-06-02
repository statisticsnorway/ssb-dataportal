'use server';

import { getM2mToken } from '@/libs/auth/m2m';
import {
  Configuration,
  ConfigurationParameters,
  DaplaDataFileDTO,
  DataFilesApi,
  DataFilesApiInterface,
  DataProductDTO,
  DataProductsApi,
  DataProductsApiInterface,
  DatasetDTO,
  DatasetsApi,
  DatasetsApiInterface,
  ResponseError,
} from '@/libs/data-access/datadoc';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger, createLoggerWithBindings } from '@/libs/logger/server-logger';
import dataProducts from '@/static-data/data-products.json';
import datasetsStatic from '@/static-data/datasets.json';
import { getUserAgent } from '@/utils/userAgent';
import { getEncodedJwt } from '../../auth/jwt';

const ttlSeconds = Number(process.env.DATADOC_CACHE_TTL_SECONDS) || 3600;

type Apis = DataProductsApiInterface | DatasetsApiInterface | DataFilesApiInterface;

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
      return Promise.reject(new Error('Could not retrieve access token!'));
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

export async function listDataProducts(): Promise<DataProductDTO[]> {
  const logger = createLogger('data-products');
  logger.info('List Data Products');
  if (process.env.DATADOC_USE_STATIC_DATA === 'true') {
    logger.warn({ fn: 'listDataProducts' }, 'Using static mock data for data products');
    return dataProducts as DataProductDTO[];
  }
  try {
    logger.info('Getting from api');
    const api = await getClientForApi(DataProductsApi);
    const startTime = Date.now();
    const rawData = await api.listDataProducts(
      {},
      {
        cache: 'force-cache',
        next: { revalidate: ttlSeconds },
      },
    );
    const durationMs = Date.now() - startTime;
    if (rawData.length > 0) {
      logger.debug({ firstProduct: rawData[0] }, 'Fetched data products');
    }
    logger.info({ count: rawData.length, durationMs }, 'Fetched data products from API');
    return rawData;
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error({ statusCode: error.response.status, url: error.response.url }, 'API request failed');
    } else {
      logger.error({ error }, 'Unexpected error during fetch');
    }
    throw error;
  }
}

export async function getDataProductByShortName(shortName: string): Promise<DataProductDTO> {
  const logger = createLogger('data-products');
  if (process.env.DATADOC_USE_STATIC_DATA === 'true') {
    logger.warn({ fn: 'getDataProductByShortName' }, 'Using static mock data for data products');
    const dataProduct = (dataProducts as DataProductDTO[]).find((d) => d.product_short_name === shortName);
    if (!dataProduct) return Promise.reject('Not found');
    return dataProduct;
  }

  try {
    const api = await getClientForApi(DataProductsApi);
    const dto = await api.getDataProductByShortName({ shortName });
    logger.info({ shortName }, 'Fetched data product');
    return dto;
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error({ statusCode: error.response.status, url: error.response.url }, 'API request failed');
    } else {
      logger.error({ error }, 'Unexpected error during fetch');
    }
    throw error;
  }
}

export async function listDatasetsByProductShortName(shortName: string): Promise<DatasetDTO[]> {
  const logger = createLogger('datasets');
  logger.info({ shortName }, 'List datasets for product');
  if (process.env.DATADOC_USE_STATIC_DATA === 'true') {
    logger.warn({ fn: 'listDatasetsByProductShortName' }, 'Using static mock data for datasets');
    return (datasetsStatic as DatasetDTO[]).filter((d) => d.product_short_name === shortName);
  }

  try {
    const api = await getClientForApi(DatasetsApi);
    const startTime = Date.now();
    const rawData = await api.listDatasets(
      { productShortName: shortName },
      {
        cache: 'force-cache',
        next: { revalidate: ttlSeconds },
      },
    );
    const durationMs = Date.now() - startTime;
    logger.info({ count: rawData.length, durationMs }, 'Fetched datasets from API');
    return rawData;
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error({ statusCode: error.response.status, url: error.response.url }, 'API request failed');
    } else {
      logger.error({ error }, 'Unexpected error during fetch');
    }
    throw error;
  }
}

export async function listDatasets(): Promise<DatasetDTO[]> {
  const logger = createLogger('datasets');
  logger.info('List datasets');
  if (process.env.DATADOC_USE_STATIC_DATA === 'true') {
    logger.warn({ fn: 'listDatasets' }, 'Using static mock data for datasets');
    return datasetsStatic as DatasetDTO[];
  }

  try {
    const api = await getClientForApi(DatasetsApi);
    const startTime = Date.now();
    const rawData = await api.listDatasets(
      {},
      {
        cache: 'force-cache',
        next: { revalidate: ttlSeconds },
      },
    );
    const durationMs = Date.now() - startTime;
    logger.info({ count: rawData.length, durationMs }, 'Fetched datasets from API');
    return rawData;
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error({ statusCode: error.response.status, url: error.response.url }, 'API request failed');
    } else {
      logger.error({ error }, 'Unexpected error during fetch');
    }
    throw error;
  }
}

export async function getDatasetById(id: string): Promise<DatasetDTO> {
  const logger = createLoggerWithBindings({ module: 'datasets', fn: 'getDatasetById', id: id });
  try {
    const api = await getClientForApi(DatasetsApi);
    const dto = await api.getDatasetById({ id: id });
    logger.info('Fetched Dataset');
    return dto;
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error({ statusCode: error.response.status, url: error.response.url }, 'API request failed');
    } else {
      logger.error({ error }, 'Unexpected error during fetch');
    }
    throw error;
  }
}

export async function listDataFilesByDatasetId(datasetId: string): Promise<Array<DaplaDataFileDTO>> {
  const logger = createLoggerWithBindings({ module: 'datasets', fn: 'listDataFilesByDatasetId', id: datasetId });
  try {
    const api = await getClientForApi(DataFilesApi);
    const dto = await api.listDataFiles({ datasetId: datasetId });
    logger.info('Fetched Dapla Data Files');
    logger.info({ count: dto.length }, 'Fetched data products from API');
    return dto;
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error({ statusCode: error.response.status, url: error.response.url }, 'API request failed');
    } else {
      logger.error({ error }, 'Unexpected error during fetch');
    }
    throw error;
  }
}
