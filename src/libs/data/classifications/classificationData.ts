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
import { SupportedLanguages } from '@/libs/data-access/variable-definitions/internal/models/SupportedLanguages';
import { SupportedLanguage } from '@/libs/language';
import { createLogger } from '@/libs/logger/server-logger';
import classificationsMock from '@/static-data/classifications.json';
import { normalizeClassificationTypes } from '@/utils/classifications/classificationHelpers';
import { getClassification, parseClassification } from '@/utils/mock-data';
import { getUserAgent } from '@/utils/userAgent';

const ttlSeconds = Number(process.env.KLASS_CACHE_TTL_SECONDS);

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

export type ClassificationWithLanguage = ClassificationResource & {
  /** Language actually used to populate `name`/`description`. Undefined when it matches the requested language. */
  fallbackLanguage?: SupportedLanguage;
};

const FALLBACK_ORDER: SupportedLanguage[] = [SupportedLanguages.Nb, SupportedLanguages.Nn, SupportedLanguages.En];

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

/**
 * Returns true if the candidate should replace the existing classification entry.
 *
 * @param existing Current entry.
 * @param candidate Candidate replacement entry.
 * @returns Whether the candidate is preferred.
 */
function isBetterEntry(existing: ClassificationWithLanguage, candidate: ClassificationWithLanguage): boolean {
  // Prefer the requested language (no fallback flag) over any fallback entry.
  if (existing.fallbackLanguage && !candidate.fallbackLanguage && candidate.name) {
    return true;
  }
  // Prefer any named entry over a nameless one.
  if (!existing.name && candidate.name) {
    return true;
  }
  return false;
}

/**
 * Converts a classification to the language-aware entry format.
 *
 * @param c Classification resource.
 * @param lang Language of the resource.
 * @param requested Requested language.
 * @returns Classification entry with fallback language metadata.
 */
function toEntry(
  c: ClassificationResource,
  lang: SupportedLanguage,
  requested: SupportedLanguage,
): ClassificationWithLanguage {
  return {
    ...c,
    fallbackLanguage: lang === requested ? undefined : lang,
  };
}

/**
 * Fetches all classifications, preferring the requested language and falling back as needed.
 *
 * @param language Preferred language (defaults to nb).
 * @returns Classifications with fallback language metadata.
 */
export async function fetchAllClassifications(
  language: SupportedLanguage | undefined = 'nb',
): Promise<ClassificationWithLanguage[]> {
  const logger = createLogger('classification-data');

  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    logger.warn('Using static mock data for classifications');
    return classificationsMock.classifications.map((c) => toEntry(parseClassification(c), 'nb', language));
  }

  const languages = [language, ...FALLBACK_ORDER.filter((l) => l !== language)] as SupportedLanguage[];

  const perLanguage = await Promise.all(
    languages.map(async (lang) => [lang, await fetchAllClassificationsForLanguage(lang)] as const),
  );

  const byId = new Map<number, ClassificationWithLanguage>();
  for (const [lang, list] of perLanguage) {
    for (const c of list) {
      if (c.id == null) continue;
      const candidate = toEntry(c, lang, language);
      const existing = byId.get(c.id);
      if (!existing || isBetterEntry(existing, candidate)) {
        byId.set(c.id, candidate);
      }
    }
  }

  return [...byId.values()];
}

export async function fetchClassificationForLanguage(
  id: number,
  language: SupportedLanguage | undefined = 'nb',
): Promise<ClassificationResource | null> {
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

export async function fetchClassificationById(
  id: number,
  language: SupportedLanguage | undefined = 'nb',
): Promise<ClassificationWithLanguage> {
  const logger = createLogger('classification-data');

  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    logger.warn('Using static mock data for classifications');
    return toEntry(getClassification(id), 'nb', language);
  }

  const languages = [language, ...FALLBACK_ORDER.filter((l) => l !== language)] as SupportedLanguage[];

  const results = await Promise.all(
    languages.map(async (lang) => {
      try {
        const resource = await fetchClassificationForLanguage(id, lang);
        return resource ? toEntry(resource, lang, language) : null;
      } catch (error) {
        logger.warn({ id, lang, error: String(error) }, 'Classification fetch failed for language');
        return null;
      }
    }),
  );

  const chosen = results.find((r) => r?.name) ?? results.find((r): r is ClassificationWithLanguage => r !== null);
  if (!chosen) throw new Error(`Classification ${id} not available in any supported language`);

  return chosen;
}
