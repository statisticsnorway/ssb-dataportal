'use server';

import { ClassificationsLanguageEnum } from '@/libs/data-access/klass/apis/ClassificationsApi';
import { VersionsApi } from '@/libs/data-access/klass/apis/VersionsApi';
import { ClassificationVersionResource } from '@/libs/data-access/klass/models/ClassificationVersionResource';
import { Configuration, ConfigurationParameters, ResponseError } from '@/libs/data-access/klass/runtime';
import { SupportedLanguage } from '@/libs/language';
import { createLogger } from '@/libs/logger/server-logger';
import versionsMock from '@/static-data/versions.json';
import { parseVersion } from '@/utils/classifications/classificationHelpers';
import { getUserAgent } from '@/utils/userAgent';

const ttlSeconds = Number(process.env.KLASS_CACHE_TTL_SECONDS);

async function getKlassVersionsClient(): Promise<VersionsApi> {
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

  return new VersionsApi(new Configuration(configParams));
}

export async function fetchVersionById(
  id: number,
  language: SupportedLanguage | undefined = 'nb',
): Promise<ClassificationVersionResource> {
  const logger = createLogger('classification-versions-data');
  const api = await getKlassVersionsClient();

  const params = {
    id,
    language: language.toUpperCase() as ClassificationsLanguageEnum,
  };

  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    logger.warn({ id }, 'Using static mock data for versions');

    const version = versionsMock.versions.find((v) => v.id === id);

    if (!version) {
      throw new Error(`Version with id=${id} not found in static data`);
    }

    return parseVersion(version);
  }

  try {
    return await api.versions(params, {
      cache: 'force-cache',
      next: { revalidate: ttlSeconds },
    } as RequestInit);
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error({ statusCode: error.response.status, url: error.response.url, id }, 'Version fetch by ID failed');
    } else {
      logger.error({ error: String(error), id }, 'Unexpected error during version fetch');
    }
    throw error;
  }
}
