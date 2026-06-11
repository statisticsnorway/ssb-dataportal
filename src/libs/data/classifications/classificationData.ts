'use server';

import {
  ClassificationRequest,
  ClassificationsApi,
  ClassificationsRequest,
} from '@/libs/data-access/klass/apis/ClassificationsApi';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { KlassPagedResourcesClassificationSummaryResourceFromJSON } from '@/libs/data-access/klass/models/KlassPagedResourcesClassificationSummaryResource';
import { Configuration, ConfigurationParameters, ResponseError } from '@/libs/data-access/klass/runtime';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import classificationsMock from '@/static-data/classifications.json';
import { linkObj } from '@/types/classification';
import { parseClassification } from '@/utils/functions';
import { getClassification } from '@/utils/mock-data';
import { getUserAgent } from '@/utils/userAgent';

const ttlSeconds = Number(process.env.KLASS_CACHE_TTL_SECONDS);

export interface ClassificationResponse {
  classifications: ClassificationResource[];
  pageInfo: number;
  links: linkObj[];
}

export async function getKlassClassificationsClient(): Promise<ClassificationsApi> {
  const logger = createLogger('classification-data');
  let configParams = {
    headers: {
      'User-Agent': getUserAgent(),
    },
  } as ConfigurationParameters;

  const klassBasePath = process.env.KLASS_BASE_PATH;
  if (klassBasePath) {
    const basePath = new URL(klassBasePath).origin;
    logger.debug({ basePath }, 'Klass API base path configured');
    configParams.basePath = basePath;
  }

  return new ClassificationsApi(new Configuration(configParams));
}

export async function fetchAllClassifications(): Promise<ClassificationResource[]> {
  const logger = createLogger('classification-data');

  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    logger.warn('Using static mock data for classifications');
    return classificationsMock.classifications.map((classification) => parseClassification(classification));
  }

  const api = await getKlassClassificationsClient();

  const params = {
    includeCodelists: true,
  } satisfies ClassificationsRequest;

  try {
    const startTime = Date.now();
    let data = await api.classifications(params, {
      cache: 'force-cache',
      next: { revalidate: ttlSeconds },
    } as RequestInit);
    const allClassifications = [...(data.embedded?.classifications ?? [])];

    while (data.links?.['next']?.href) {
      const nextUrl = data.links['next'].href;
      const res = await fetch(nextUrl, {
        headers: { 'User-Agent': getUserAgent() },
      });
      if (!res.ok) {
        logger.error({ statusCode: res.status, url: res.url }, 'Classification fetch failed on pagination');
        throw new Error('Failed to fetch classifications page');
      }
      data = KlassPagedResourcesClassificationSummaryResourceFromJSON(await res.json());
      allClassifications.push(...(data.embedded?.classifications ?? []));
    }

    const durationMs = Date.now() - startTime;
    logger.info({ count: allClassifications.length, durationMs }, 'Fetched classifications from API');
    return allClassifications as ClassificationResource[];
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error({ statusCode: error.response.status, url: error.response.url }, 'Classification fetch failed');
    } else {
      logger.error({ error: sanitizeError(error) }, 'Unexpected error during fetch');
    }
    throw error;
  }
}

export async function fetchClassificationById(id: number): Promise<ClassificationResource> {
  let classification: ClassificationResource;
  const logger = createLogger('classification-data');

  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    logger.warn('Using static mock data for classifications');
    classification = getClassification(id);
  } else {
    const api = await getKlassClassificationsClient();
    const params = {
      id,
    } satisfies ClassificationRequest;

    try {
      classification = await api.classification(params, {
        cache: 'force-cache',
        next: { revalidate: ttlSeconds },
      } as RequestInit);
    } catch (error: unknown) {
      if (error instanceof ResponseError) {
        logger.error(
          { statusCode: error.response.status, url: error.response.url },
          'Classification fetch by ID failed',
        );
      } else {
        logger.error({ error: sanitizeError(error) }, 'Unexpected error during fetch');
      }
      throw error;
    }
  }
  return classification;
}
