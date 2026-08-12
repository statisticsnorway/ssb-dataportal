'use server';

import {
  ClassificationRequest,
  ClassificationsApi,
  ClassificationsLanguageEnum,
  ClassificationsRequest,
} from '@/libs/data-access/klass/apis/ClassificationsApi';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { KlassPagedResourcesClassificationSummaryResourceFromJSON } from '@/libs/data-access/klass/models/KlassPagedResourcesClassificationSummaryResource';

import { Configuration, ConfigurationParameters, ResponseError } from '@/libs/data-access/klass/runtime';
import { SupportedLanguage } from '@/libs/language';
import { createLogger } from '@/libs/logger/server-logger';
import classificationsMock from '@/static-data/classifications.json';
import { normalizeClassificationTypes } from '@/utils/classifications/classificationHelpers';
import { getClassification, parseClassification } from '@/utils/mock-data';
import { getUserAgent } from '@/utils/userAgent';

const ttlSeconds = Number(process.env.KLASS_CACHE_TTL_SECONDS);

export type ClassificationWithLanguage = ClassificationResource & {
  /** Language actually used to populate `name`/`description`. Undefined when it matches the requested language. */
  fallbackLanguage?: SupportedLanguage;
};

const FALLBACK_ORDER: SupportedLanguage[] = ['nb', 'nn', 'en'];

async function getKlassClassificationsClient(): Promise<ClassificationsApi> {
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

/**
 * Fetches all classifications from the Klass API for a single language, paginating
 * through `links.next` until exhausted. Returns raw resources (no fallback merging).
 * Static-data mode is handled by the caller.
 */
async function fetchAllClassificationsForLanguage(language: SupportedLanguage): Promise<ClassificationResource[]> {
  const logger = createLogger('classification-data');
  const api = await getKlassClassificationsClient();

  const params = {
    includeCodelists: true,
    includeDescription: true,
    language: language.toUpperCase() as ClassificationsLanguageEnum,
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
        cache: 'force-cache',
        next: { revalidate: ttlSeconds },
      } as RequestInit);
      if (!res.ok) {
        logger.error({ statusCode: res.status, url: res.url, language }, 'Classification fetch failed on pagination');
        throw new Error('Failed to fetch classifications page');
      }
      data = KlassPagedResourcesClassificationSummaryResourceFromJSON(await res.json());
      allClassifications.push(...(data.embedded?.classifications ?? []));
    }

    const durationMs = Date.now() - startTime;
    logger.info({ count: allClassifications.length, durationMs, language }, 'Fetched classifications from API');
    return allClassifications.map(normalizeClassificationTypes);
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error(
        { statusCode: error.response.status, url: error.response.url, language },
        'Classification fetch failed',
      );
    } else {
      logger.error({ error: String(error), language }, 'Unexpected error during fetch');
    }
    throw error;
  }
}

export async function fetchAllClassifications(
  language: SupportedLanguage | undefined = 'nb',
): Promise<ClassificationWithLanguage[]> {
  const logger = createLogger('classification-data');

  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    logger.warn('Using static mock data for classifications');
    return classificationsMock.classifications.map((c) => parseClassification(c));
  }

  const languages = [language, ...FALLBACK_ORDER.filter((l) => l !== language)] as SupportedLanguage[];

  const perLanguage = await Promise.all(
    languages.map(async (lang) => [lang, await fetchAllClassificationsForLanguage(lang)] as const),
  );

  const byId = new Map<number, ClassificationWithLanguage>();

  for (const [lang, list] of perLanguage) {
    for (const c of list) {
      if (c.id == null) continue;
      const existing = byId.get(c.id);
      // First time we see this id: record it, marking as fallback if the
      // content came from a non-requested language.
      if (!existing) {
        byId.set(c.id, {
          ...c,
          fallbackLanguage: lang === language ? undefined : lang,
        });
        continue;
      }
      // Upgrade a fallback entry once the requested language actually has a name.
      if (existing.fallbackLanguage && lang === language && c.name) {
        byId.set(c.id, { ...c, fallbackLanguage: undefined });
        continue;
      }
      // Replace a nameless entry with any language that has a name
      // (still flagged as fallback when it isn't the requested language).
      if (!existing.name && c.name) {
        byId.set(c.id, { ...c, fallbackLanguage: lang === language ? undefined : lang });
      }
    }
  }

  return [...byId.values()];
}

export async function fetchClassificationById(
  id: number,
  language: SupportedLanguage | undefined = 'nb',
): Promise<ClassificationResource> {
  let classification: ClassificationResource;
  const logger = createLogger('classification-data');

  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    logger.warn('Using static mock data for classifications');
    classification = getClassification(id);
  } else {
    const api = await getKlassClassificationsClient();
    const params = {
      id,
      language: language.toUpperCase() as ClassificationsLanguageEnum,
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
        logger.error({ error: String(error) }, 'Unexpected error during fetch');
      }
      throw error;
    }
  }
  return classification;
}
