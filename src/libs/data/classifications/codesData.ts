'use server';

import { ClassificationLanguageEnum, ClassificationsApi } from '@/libs/data-access/klass/apis/ClassificationsApi';
import { VersionsApi, VersionsLanguageEnum } from '@/libs/data-access/klass/apis/VersionsApi';
import { Configuration, ConfigurationParameters, ResponseError } from '@/libs/data-access/klass/runtime';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import codesMock from '@/static-data/codes-mock.json';
import type { KlassCode } from '@/types/klass-codes';
import { mapClassificationItemToKlassCode } from '@/utils/classifications/codeMappers';
import { getUserAgent } from '@/utils/userAgent';

const ttlSeconds = Number(process.env.KLASS_CACHE_TTL_SECONDS);

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

function getClassificationsClient(): ClassificationsApi {
  return new ClassificationsApi(new Configuration(buildKlassClientConfig()));
}

function getVersionsClient(): VersionsApi {
  return new VersionsApi(new Configuration(buildKlassClientConfig()));
}

/**
 * Fetches codes for a specific classification version by its version ID.
 * Uses `VersionsApi.versions` and extracts `classificationItems`.
 * Falls back to static mock data when `KLASS_USE_STATIC_DATA=true`.
 */
export async function fetchVersionCodes(versionId: number): Promise<KlassCode[]> {
  const logger = createLogger('codes-data');

  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    logger.warn({ versionId }, 'Using static mock data for version codes');
    const key = String(versionId) as keyof typeof codesMock.versionCodes;
    return (codesMock.versionCodes[key] ?? []) as KlassCode[];
  }

  const api = getVersionsClient();
  try {
    const data = await api.versions({ id: versionId, language: VersionsLanguageEnum.NB }, {
      cache: 'force-cache',
      next: { revalidate: ttlSeconds },
    } as RequestInit);
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

/**
 * Fetches the codes for the latest version of a classification.
 *
 * Resolves the latest version by fetching the classification's version list and
 * picking the entry with the most recent `validFrom` date. Then delegates to
 * `fetchVersionCodes` so the same caching/mapping logic applies.
 *
 * Falls back to static mock data when `KLASS_USE_STATIC_DATA=true`.
 */
export async function fetchLatestVersionCodes(classificationId: number): Promise<KlassCode[]> {
  const logger = createLogger('codes-data');

  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    logger.warn({ classificationId }, 'Using static mock data for latest version codes');
    const key = String(classificationId) as keyof typeof codesMock.currentCodes;
    return (codesMock.currentCodes[key] ?? []) as KlassCode[];
  }

  // This call shares Next.js's Data Cache with the layout's identical fetch,
  // so it does not add a second network round-trip.
  const classApi = getClassificationsClient();
  let classification: Awaited<ReturnType<ClassificationsApi['classification']>>;
  try {
    classification = await classApi.classification({ id: classificationId, language: ClassificationLanguageEnum.NB }, {
      cache: 'force-cache',
      next: { revalidate: ttlSeconds },
    } as RequestInit);
  } catch (error) {
    if (error instanceof ResponseError) {
      logger.error(
        { statusCode: error.response.status, url: error.response.url, classificationId },
        'Failed to fetch classification for version lookup',
      );
    } else {
      logger.error({ error: sanitizeError(error) }, 'Unexpected error fetching classification');
    }
    throw error;
  }

  const versions = classification.versions ?? [];
  if (versions.length === 0) {
    logger.warn({ classificationId }, 'Classification has no versions');
    return [];
  }

  const latestVersion = [...versions].sort((a, b) => (b.validFrom?.getTime() ?? 0) - (a.validFrom?.getTime() ?? 0))[0]!;

  if (!latestVersion.id) {
    logger.warn({ classificationId }, 'Latest version has no id');
    return [];
  }

  logger.info(
    { classificationId, versionId: latestVersion.id, versionName: latestVersion.name },
    'Resolved latest version',
  );

  return fetchVersionCodes(latestVersion.id);
}
