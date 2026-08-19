'use server';

import {
  CorrespondenceItem,
  CorrespondenceTableResource,
  CorrespondenceTablesApi,
  CorrespondenceTablesLanguageEnum,
  CorrespondsAtLanguageEnum,
} from '@/libs/data-access/klass';
import { Configuration, ConfigurationParameters, ResponseError } from '@/libs/data-access/klass/runtime';
import { SupportedLanguage } from '@/libs/language';
import { createLogger } from '@/libs/logger/server-logger';
import { getUserAgent } from '@/utils/userAgent';
import { querystringFormatDates } from './utils';

const ttlSeconds = Number(process.env.KLASS_CACHE_TTL_SECONDS);
const logger = createLogger('classification-correspondences-data');

function buildKlassClientConfig(): ConfigurationParameters {
  const config: ConfigurationParameters = {
    headers: {
      'User-Agent': getUserAgent(),
    },
    queryParamsStringify: querystringFormatDates,
  };
  const klassBasePath = process.env.KLASS_BASE_PATH;
  if (klassBasePath) {
    config.basePath = new URL(klassBasePath).origin;
  }
  return config;
}

function getCorrespondenceTablesClient(): CorrespondenceTablesApi {
  return new CorrespondenceTablesApi(new Configuration(buildKlassClientConfig()));
}

const fetchInit = {
  cache: 'force-cache',
  next: { revalidate: ttlSeconds },
} as RequestInit;

function toKlassLanguage(language: SupportedLanguage): 'NB' | 'NN' | 'EN' {
  return language.toUpperCase() as 'NB' | 'NN' | 'EN';
}

export async function fetchCorrespondenceTable(
  id: number,
  language: SupportedLanguage = 'nb',
): Promise<CorrespondenceTableResource> {
  const api = getCorrespondenceTablesClient();
  try {
    return await api.correspondenceTables(
      {
        id,
        language: toKlassLanguage(language) as CorrespondenceTablesLanguageEnum,
      },
      fetchInit,
    );
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error(
        {
          id,
          statusCode: error.response.status,
          url: error.response.url,
        },
        'Failed to fetch correspondence table',
      );
    } else {
      logger.error({ id, error: String(error) }, 'Unexpected error fetching correspondence table');
    }
    throw error;
  }
}

export async function fetchCorrespondenceItemsAt(
  sourceClassificationId: number,
  targetClassificationId: number,
  date: Date,
  language: SupportedLanguage = 'nb',
): Promise<CorrespondenceItem[]> {
  const api = getCorrespondenceTablesClient();
  try {
    const response = await api.correspondsAt(
      {
        id: sourceClassificationId,
        targetClassificationId,
        date,
        language: toKlassLanguage(language) as CorrespondsAtLanguageEnum,
      },
      fetchInit,
    );
    return response.correspondenceItems ?? [];
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error(
        {
          sourceClassificationId,
          targetClassificationId,
          date,
          statusCode: error.response.status,
          url: error.response.url,
        },
        'Failed to fetch correspondence items',
      );
    } else {
      logger.error(
        {
          sourceClassificationId,
          targetClassificationId,
          date,
          error: String(error),
        },
        'Unexpected error fetching correspondence items',
      );
    }
    throw error;
  }
}
