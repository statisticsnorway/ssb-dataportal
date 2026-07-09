'use server';

import { VersionsApi, VersionsLanguageEnum } from '@/libs/data-access/klass/apis/VersionsApi';
import { Configuration, ConfigurationParameters, ResponseError } from '@/libs/data-access/klass/runtime';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import codesMock from '@/static-data/codes-mock.json';
import type { KlassCode } from '@/types/klass-codes';
import { mapClassificationItemToKlassCode } from '@/utils/classifications/codeMappers';
import { getUserAgent } from '@/utils/userAgent';

const ttlSeconds = Number(process.env.KLASS_CACHE_TTL_SECONDS);
const logger = createLogger('codes-data');
const fetchInit = { cache: 'force-cache', next: { revalidate: ttlSeconds } } as RequestInit;

function buildKlassClientConfig(): ConfigurationParameters {
  const config: ConfigurationParameters = {
    headers: { 'User-Agent': getUserAgent() },
  };
  const klassBasePath = process.env.KLASS_BASE_PATH;
  if (klassBasePath) {
    config.basePath = new URL(klassBasePath).origin;
  }
  return config;
}

/*
function getClassificationsClient(): ClassificationsApi {
  return new ClassificationsApi(new Configuration(buildKlassClientConfig()));
}*/

function getVersionsClient(): VersionsApi {
  return new VersionsApi(new Configuration(buildKlassClientConfig()));
}

/**
 * Fetches codes for a specific classification version by its version ID.
 * Uses `VersionsApi.versions` and extracts `classificationItems`.
 * Falls back to static mock data when `KLASS_USE_STATIC_DATA=true`.
 */
export async function fetchVersionCodes(versionId: number): Promise<KlassCode[]> {
  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    logger.warn({ versionId }, 'Using static mock data for version codes');
    const key = String(versionId) as keyof typeof codesMock.versionCodes;
    return (codesMock.versionCodes[key] ?? []) as KlassCode[];
  }

  const api = getVersionsClient();
  try {
    const data = await api.versions({ id: versionId, language: VersionsLanguageEnum.NB }, fetchInit);
    const items = data.classificationItems ?? [];
    logger.info({ versionId, count: items.length }, 'Fetched version codes');
    return items.map(mapClassificationItemToKlassCode);
  } catch (error) {
    if (error instanceof ResponseError) {
      logger.error(
        { statusCode: error.response.status, url: error.response.url, versionId },
        'Failed to fetch version codes',
      );
    } else {
      logger.error({ error: sanitizeError(error) }, 'Unexpected error fetching version codes');
    }
    throw error;
  }
}

