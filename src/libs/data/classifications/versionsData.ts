'use server';

import { ClassificationsLanguageEnum } from '@/libs/data-access/klass/apis/ClassificationsApi';
import { VersionsApi } from '@/libs/data-access/klass/apis/VersionsApi';
import { ClassificationVersionResource } from '@/libs/data-access/klass/models/ClassificationVersionResource';
import { Configuration, ConfigurationParameters, ResponseError } from '@/libs/data-access/klass/runtime';
import { SupportedLanguage } from '@/libs/language';
import { createLogger } from '@/libs/logger/server-logger';
import versionsMock from '@/static-data/versions.json';
import { parseVersion } from '@/utils/mock-data';
import { getUserAgent } from '@/utils/userAgent';
import { FALLBACK_ORDER } from './utils';

const ttlSeconds = Number(process.env.KLASS_CACHE_TTL_SECONDS);

export type VersionWithLanguage = ClassificationVersionResource & {
  /** Language actually used to populate `name`/`description`. Undefined when it matches the requested language. */
  fallbackLanguage?: SupportedLanguage;
};

/**
 * Converts a version to the language-aware entry format.
 *
 * @param c Version resource.
 * @param lang Language of the resource.
 * @param requested Requested language.
 * @returns Version entry with fallback language metadata.
 */
function toEntry(
  c: ClassificationVersionResource,
  lang: SupportedLanguage,
  requested: SupportedLanguage,
): VersionWithLanguage {
  return {
    ...c,
    fallbackLanguage: lang === requested ? undefined : lang,
  };
}

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

export async function fetchVersionForLanguage(
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

export async function fetchVersionById(
  id: number,
  language: SupportedLanguage | undefined = 'nb',
): Promise<VersionWithLanguage | undefined> {
  const logger = createLogger('classification-versions-data');

  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    logger.warn({ id }, 'Using static mock data for versions');

    const version = versionsMock.versions.find((v) => v.id === id);

    if (!version) {
      logger.debug({ id }, 'Version not found in static data');
      return undefined;
    }

    return toEntry(parseVersion(version), 'nb', language);
  }

  const languages = [language, ...FALLBACK_ORDER.filter((l) => l !== language)] as SupportedLanguage[];

  const results = await Promise.all(
    languages.map(async (lang) => {
      try {
        const resource = await fetchVersionForLanguage(id, lang);
        return resource ? toEntry(resource, lang, language) : null;
      } catch (error) {
        logger.warn({ id, lang, error: String(error) }, 'Version fetch failed for language');
        return null;
      }
    }),
  );
  const chosen = results.find((r) => r?.name) ?? results.find((r): r is VersionWithLanguage => r !== null);
  if (!chosen) throw new Error(`Version ${id} not available in any supported language`);

  return chosen;
}
