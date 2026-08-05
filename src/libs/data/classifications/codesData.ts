'use server';

import { ChangesRequest, CodeChangeItem, CodeChangeItemFromJSON, CodesApi } from '@/libs/data-access/klass';
import { VersionsApi, VersionsLanguageEnum } from '@/libs/data-access/klass/apis/VersionsApi';
import { Configuration, ConfigurationParameters, ResponseError } from '@/libs/data-access/klass/runtime';
import { SupportedLanguage } from '@/libs/language';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import changesMock from '@/static-data/classification-changes.json';
import codesMock from '@/static-data/codes-mock.json';
import type { KlassCode } from '@/types/klass-codes';
import { mapClassificationItemToKlassCode } from '@/utils/classifications/codeMappers';
import { getUserAgent } from '@/utils/userAgent';
import { querystringFormatDates } from './utils';

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
    config.queryParamsStringify = querystringFormatDates;
  }
  return config;
}

function getVersionsClient(): VersionsApi {
  return new VersionsApi(new Configuration(buildKlassClientConfig()));
}

function getCodesClient(): CodesApi {
  return new CodesApi(new Configuration(buildKlassClientConfig()));
}

/**
 * Fetches codes for a specific classification version by its version ID.
 * Uses `VersionsApi.versions` and extracts `classificationItems`.
 * Falls back to static mock data when `KLASS_USE_STATIC_DATA=true`.
 */
export async function fetchVersionCodes(
  versionId: number,
  language: VersionsLanguageEnum | undefined = VersionsLanguageEnum.NB,
): Promise<KlassCode[]> {
  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    logger.warn({ versionId }, 'Using static mock data for version codes');
    const key = String(versionId) as keyof typeof codesMock.versionCodes;
    return (codesMock.versionCodes[key] ?? []) as KlassCode[];
  }

  const api = getVersionsClient();
  try {
    const params = { id: versionId, language: language };
    const data = await api.versions(params, fetchInit);
    const items = data.classificationItems ?? [];
    logger.info({ params, count: items.length }, 'Fetched version codes');
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

export async function fetchChanges(
  classificationId: number,
  from: Date,
  to?: Date,
  language: VersionsLanguageEnum | undefined = VersionsLanguageEnum.NB,
): Promise<CodeChangeItem[]> {
  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    logger.warn({ versionId: classificationId }, 'Using static mock data for changes');
    const key = String(classificationId) as keyof typeof changesMock;
    return (changesMock[key]?.codeChanges.map(CodeChangeItemFromJSON) ?? []) as CodeChangeItem[];
  }

  const api = getCodesClient();
  try {
    const params = { id: classificationId, from: from, to: to, language: language } satisfies ChangesRequest;
    const data = await api.changes(params, fetchInit);
    logger.info({ params, count: data.codeChanges?.length }, 'Fetched changes');
    return data.codeChanges ?? [];
  } catch (error) {
    if (error instanceof ResponseError) {
      logger.error(
        {
          statusCode: error.response.status,
          url: error.response.url,
          message: error.response.body,
          versionId: classificationId,
        },
        'Failed to fetch changes',
      );
    } else {
      logger.error({ error: sanitizeError(error) }, 'Unexpected error fetching changes');
    }
    throw error;
  }
}

export async function fetchSubjectFieldFilterValues(
  language: SupportedLanguage | undefined = 'nb',
): Promise<KlassCode[]> {
  const id = process.env.SUBJECT_FIELD_CLASSIFICATION_VERSION_ID;
  if (!id) {
    throw new Error('Necessary data not provided');
  }
  return (await fetchVersionCodes(Number(id), language.toUpperCase() as VersionsLanguageEnum)).filter(
    (code) => code.level == '1',
  );
}
