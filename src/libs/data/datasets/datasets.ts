'use server';

import { getM2mToken } from '@/libs/auth/m2m';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger, createLoggerWithBindings } from '@/libs/logger/server-logger';
import dataProducts from '@/static-data/data-products.json';
import datasetsStatic from '@/static-data/datasets.json';
import dataFilesStatic_id1 from '@/static-data/id1.json';
import dataFilesStatic_id2 from '@/static-data/id2.json';
import dataFilesStatic_id3 from '@/static-data/id3.json';
import dataFilesStatic_id4 from '@/static-data/id4.json';
import dataFilesStatic_id5 from '@/static-data/id5.json';
import dataFilesStatic_id6 from '@/static-data/id6.json';
import { getUserAgent } from '@/utils/userAgent';
import { getEncodedJwt } from '../../auth/jwt';
import { DefaultApi } from '../../data-access/datadoc/apis';
import { DaplaDataFileDTO, DataProductDTO, DatasetDTO } from '../../data-access/datadoc/models';
import { Configuration, ConfigurationParameters, ResponseError } from '../../data-access/datadoc/runtime';

const ttlSeconds = Number(process.env.DATADOC_CACHE_TTL_SECONDS) || 3600;

export async function getDataDocClient(): Promise<DefaultApi> {
  const logger = createLogger('data-products');
  let token = process.env.SSB_DATAPORTAL_JWT_TOKEN;
  if (token) {
    logger.warn('Using hardcoded access token from environment! (SSB_DATAPORTAL_JWT_TOKEN)');
  } else if (process.env.DATADOC_USE_M2M_TOKEN === 'true') {
    logger.info('Using M2M token for DataDoc auth');
    token = await getM2mToken();
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
  return new DefaultApi(new Configuration(configParams));
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
    const api = await getDataDocClient();
    const startTime = Date.now();
    const rawData = await api.listDataProducts({}, {
      cache: 'force-cache',
      next: { revalidate: ttlSeconds },
    } as RequestInit);
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
    const api = await getDataDocClient();
    const dto = await api.getByShortName({ shortName });
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
    const api = await getDataDocClient();
    const startTime = Date.now();
    const rawData = await api.listDatasets({ productShortName: shortName }, {
      cache: 'force-cache',
      next: { revalidate: ttlSeconds },
    } as RequestInit);
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
  if (process.env.DATADOC_USE_STATIC_DATA === 'true') {
    logger.warn({ fn: 'getDatasetById' }, 'Using static mock data for datasets');
    const dataset = (datasetsStatic as DatasetDTO[]).find((d) => d.id === id);
    if (!dataset) return Promise.reject('Not found');
    return dataset;
  }

  try {
    const api = await getDataDocClient();
    const dto = await api.getById({ id: id });
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
  if (process.env.DATADOC_USE_STATIC_DATA === 'true') {
    logger.warn({ fn: 'listDataFilesByDatasetId' }, 'Using static mock data for data files');

    if (datasetId == 'id1') {
      var dataFilesStatic = dataFilesStatic_id1;
    } else if (datasetId == 'id2') {
      var dataFilesStatic = dataFilesStatic_id2;
    } else if (datasetId == 'id3') {
      var dataFilesStatic = dataFilesStatic_id3;
    } else if (datasetId == 'id3') {
      var dataFilesStatic = dataFilesStatic_id4;
    } else if (datasetId == 'id5') {
      var dataFilesStatic = dataFilesStatic_id5;
    } else if (datasetId == 'id6') {
      var dataFilesStatic = dataFilesStatic_id6;
    } else {
      dataFilesStatic = dataFilesStatic_id1;
    }

    const mapped = (dataFilesStatic as unknown as Array<any>).map((f) => {
      //TODO: see if this can be better
      return {
        ...f,
        contains_data_from: f.contains_data_from ? new Date(f.contains_data_from) : undefined,
        contains_data_until: f.contains_data_until ? new Date(f.contains_data_until) : undefined,
        data_last_modified_at: f.data_last_modified_at ? new Date(f.data_last_modified_at) : undefined,
      } as DaplaDataFileDTO;
    });
    return mapped;
  }
  try {
    const api = await getDataDocClient();
    const dto = await api.listDaplaDataFiles({ datasetId: datasetId });
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
