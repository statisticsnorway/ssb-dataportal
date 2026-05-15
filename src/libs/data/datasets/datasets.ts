'use server';

import { getM2mToken } from '@/libs/auth/m2m';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import dataProducts from '@/static-data/data-products.json';
import { DataProduct } from '@/types/dataset';
import { getUserAgent } from '@/utils/userAgent';
import { getEncodedJwt } from '../../auth/jwt';
import { DefaultApi } from '../../data-access/datadoc/apis';
import { DataProductDTO } from '../../data-access/datadoc/models';
import { Configuration, ConfigurationParameters, ResponseError } from '../../data-access/datadoc/runtime';

const ttlSeconds = Number(process.env.DATADOC_CACHE_TTL_SECONDS) || 3600;

export async function getDataDocClient(): Promise<DefaultApi> {
  const logger = createLogger('data-products');
  let token = process.env.SSB_DATAPORTAL_JWT_TOKEN;
  if (token) {
    logger.warn('Using hardcoded access token from environment! (SSB_DATAPORTAL_JWT_TOKEN)');
  } else if (process.env.DATADOC_USE_M2M_TOKEN === 'true') {
    logger.debug('Using M2M token for DataDoc auth');
    token = await getM2mToken();
  } else {
    token = await getEncodedJwt().catch((reason) => {
      logger.error({ error: sanitizeError(reason) }, 'JWT retrieval unexpectedly failed');
      return undefined;
    });
    if (!token) {
      logger.debug('No JWT token found in request headers');
      return Promise.reject('Could not retrieve access token!');
    }
    logger.debug('Successfully retrieved JWT from authorization header');
  }
  let configParams = {
    accessToken: token,
    headers: {
      'User-Agent': getUserAgent(),
    },
  } as ConfigurationParameters;
  const basePath = process.env.DATADOC_BASE_PATH;
  if (basePath) {
    logger.debug({ basePath }, 'DataDoc API base path configured');
    configParams.basePath = basePath;
  }
  return new DefaultApi(new Configuration(configParams));
}

function mapToDataProduct(dto: DataProductDTO): DataProduct {
  return {
    product_type: dto.productType ?? '',
    product_short_name: dto.productShortName ?? '',
    title: dto.title ?? '',
  };
}

export async function listDataProducts(): Promise<DataProduct[]> {
  const logger = createLogger('data-products');
  if (process.env.DATADOC_USE_STATIC_DATA === 'true') {
    logger.warn({ fn: 'listDataProducts' }, 'Using static mock data for data products');
    return dataProducts as DataProduct[];
  }

  try {
    const api = await getDataDocClient();
    const startTime = Date.now();
    const rawData = await api.listDataProducts({}, {
      cache: 'force-cache',
      next: { revalidate: ttlSeconds },
    } as RequestInit);
    const durationMs = Date.now() - startTime;
    const data = rawData.map(mapToDataProduct);
    if (data.length > 0) {
      logger.debug({ firstProduct: data[0] }, 'Mapped data products');
    }
    logger.info({ count: data.length, durationMs }, 'Fetched data products from API');
    return data;
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error({ statusCode: error.response.status, url: error.response.url }, 'API request failed');
    } else {
      logger.error({ error: sanitizeError(error) }, 'Unexpected error during fetch');
    }
    throw error;
  }
}

export async function getDataProductByShortName(shortName: string): Promise<DataProduct> {
  const logger = createLogger('data-products');
  if (process.env.DATADOC_USE_STATIC_DATA === 'true') {
    logger.warn({ fn: 'getDataProductByShortName' }, 'Using static mock data for data products');
    const dataProduct = (dataProducts as DataProduct[]).find((d) => d.product_short_name === shortName);
    if (!dataProduct) return Promise.reject('Not found');
    return dataProduct;
  }

  try {
    const api = await getDataDocClient();
    const dto = await api.getByShortName({ shortName });
    logger.info({ shortName }, 'Fetched data product');
    return mapToDataProduct(dto);
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error({ statusCode: error.response.status, url: error.response.url }, 'API request failed');
    } else {
      logger.error({ error: sanitizeError(error) }, 'Unexpected error during fetch');
    }
    throw error;
  }
}
