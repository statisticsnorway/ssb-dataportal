'use server';

import { ClassificationsLanguageEnum } from '@/libs/data-access/klass/apis/ClassificationsApi';
import {
  CorrespondenceTablesApi,
  CorrespondenceTablesLanguageEnum,
} from '@/libs/data-access/klass/apis/CorrespondenceTablesApi';
import { VersionsApi } from '@/libs/data-access/klass/apis/VersionsApi';
import {
  ClassificationVersionResource,
  CorrespondenceTableResource,
  CorrespondenceTableResourceFromJSON,
} from '@/libs/data-access/klass/models';
import { Configuration, ConfigurationParameters, ResponseError } from '@/libs/data-access/klass/runtime';
import { SupportedLanguage } from '@/libs/language';
import { createLogger } from '@/libs/logger/server-logger';
import versionsMock from '@/static-data/versions.json';
import { parseVersion } from '@/utils/mock-data';
import { getUserAgent } from '@/utils/userAgent';

const ttlSeconds = Number(process.env.KLASS_CACHE_TTL_SECONDS);

async function getKlassVersionsClient(): Promise<VersionsApi> {
  const logger = createLogger('classification-versions-data');
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

async function getKlassCorrespondenceClient(): Promise<CorrespondenceTablesApi> {
  const configParams = {
    headers: { 'User-Agent': getUserAgent() },
  } as ConfigurationParameters;
  const klassBasePath = process.env.KLASS_BASE_PATH;
  if (klassBasePath) {
    configParams.basePath = new URL(klassBasePath).origin;
  }
  return new CorrespondenceTablesApi(new Configuration(configParams));
}

export async function fetchVersionById(
  id: number,
  language: SupportedLanguage | undefined = 'nb',
): Promise<ClassificationVersionResource | undefined> {
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
      logger.debug({ id }, 'Version not found in static data');
      return undefined;
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

export async function fetchCorrespondenceTableById(
  id: number,
  language: SupportedLanguage | undefined = 'nb',
): Promise<CorrespondenceTableResource | undefined> {
  const logger = createLogger('classification-correspondences-data');

  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    const correspondence = versionsMock.versions
      .flatMap((version) => version.correspondenceTables ?? [])
      .find((table) => table.id === id);

    return correspondence ? CorrespondenceTableResourceFromJSON(correspondence) : undefined;
  }

  const api = await getKlassCorrespondenceClient();
  try {
    return await api.correspondenceTables(
      { id, language: language.toUpperCase() as CorrespondenceTablesLanguageEnum },
      { cache: 'force-cache', next: { revalidate: ttlSeconds } } as RequestInit,
    );
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error(
        { statusCode: error.response.status, url: error.response.url, id },
        'Correspondence table fetch failed',
      );
    } else {
      logger.error({ error: String(error), id }, 'Unexpected error during correspondence table fetch');
    }
    throw error;
  }
}
