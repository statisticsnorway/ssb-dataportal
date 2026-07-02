'use server';

import {
  ClassificationLanguageEnum,
  ClassificationRequest,
  ClassificationsApi,
  ClassificationsLanguageEnum,
  ClassificationsRequest,
} from '@/libs/data-access/klass/apis/ClassificationsApi';
import { SearchApi, SearchRequest } from '@/libs/data-access/klass/apis/SearchApi';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { KlassPagedResourcesClassificationSummaryResourceFromJSON } from '@/libs/data-access/klass/models/KlassPagedResourcesClassificationSummaryResource';
import { KlassPagedResourcesSearchResultResource } from '@/libs/data-access/klass/models/KlassPagedResourcesSearchResultResource';
import {
  SearchResultResource,
  SearchResultResourceFromJSON,
} from '@/libs/data-access/klass/models/SearchResultResource';
import { Configuration, ConfigurationParameters, ResponseError } from '@/libs/data-access/klass/runtime';
import { localization } from '@/libs/language/src/localization';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import classificationsMock from '@/static-data/classifications.json';
import searchResultsMock from '@/static-data/klass-search-results.json';
import subscribersMock from '@/static-data/subscribers.json';
import { SubscribeResult, Subscriber, SubscribeStatus, ValidationMessageColors } from '@/types/subscription';
import { parseClassification } from '@/utils/classifications/classificationHelpers';
import { getClassification } from '@/utils/mock-data';
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

/**
 * Creates a configured Klass `SearchApi` client.
 *
 * The client is initialized with the application's `User-Agent` header and, when
 * the `KLASS_BASE_PATH` environment variable is set, overrides the default base
 * path with that origin. This allows pointing the client at different Klass
 * environments without code changes.
 *
 * @returns A promise that resolves to a configured `SearchApi` instance.
 */
export async function getKlassSearchClient(): Promise<SearchApi> {
  const logger = createLogger('klass-search');
  const configParams = {
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

  return new SearchApi(new Configuration(configParams));
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
    includeDescription: true,
    language: ClassificationsLanguageEnum.NB,
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
        logger.error({ statusCode: res.status, url: res.url }, 'Classification fetch failed on pagination');
        throw new Error('Failed to fetch classifications page');
      }
      data = KlassPagedResourcesClassificationSummaryResourceFromJSON(await res.json());
      allClassifications.push(...(data.embedded?.classifications ?? []));
    }

    const durationMs = Date.now() - startTime;
    logger.info({ count: allClassifications.length, durationMs }, 'Fetched classifications from API');
    return allClassifications;
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error({ statusCode: error.response.status, url: error.response.url }, 'Classification fetch failed');
    } else {
      logger.error({ error: String(error) }, 'Unexpected error during fetch');
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
      language: ClassificationLanguageEnum.NB,
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

/**
 * Fetches search results for classifications based on the provided search request.
 * @param searchRequest The search request containing query parameters: query, ssbSection, includeCodelists
 * @returns A promise that resolves to an array of search result resources.
 */
export async function fetchSearchResult(searchRequest: SearchRequest): Promise<SearchResultResource[]> {
  const logger = createLogger('klass-search');

  // Ignoring ssb section for now
  if (process.env.KLASS_SEARCH_USE_STATIC_DATA === 'true') {
    logger.warn('Using static mock data for klass search');

    const { query, includeCodelists } = searchRequest;
    const q = query?.toLowerCase() ?? '';

    // index classifications by id so we can read classificationType
    const byId = new Map(classificationsMock.classifications.map((c) => [c.id, c]));

    return searchResultsMock
      .map((r) => SearchResultResourceFromJSON(r))
      .filter((r) => !q || r.name?.toLowerCase().includes(q))
      .filter((r) => {
        if (includeCodelists) return true;
        const meta = r.id ? byId.get(r.id) : undefined;
        // fall back to name prefix if id isn't in the classifications mock
        const isCodelist = meta?.classificationType === 'Kodeliste' || r.name?.startsWith('Kodeliste');
        return !isCodelist;
      });
  }
  let searchResult: KlassPagedResourcesSearchResultResource;
  const api = await getKlassSearchClient();
  try {
    searchResult = await api.search(searchRequest, {
      cache: 'no-store',
    } as RequestInit);
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error(
        { statusCode: error.response.status, url: error.response.url },
        'Search fetch from Klass api failed',
      );
    } else {
      logger.error({ error: sanitizeError(error) }, 'Unexpected error during fetch');
    }
    throw error;
  }
  return searchResult.embedded?.searchResults ?? [];
}

/**
 *
 * @param path
 * @param params
 * @returns
 */
async function klassPost(path: string, params: Record<string, string>): Promise<Response> {
  const klassBasePath = process.env.KLASS_BASE_PATH;
  if (!klassBasePath) throw new Error('KLASS_BASE_PATH is not configured');

  const origin = new URL(klassBasePath).origin;
  const url = new URL(`${origin}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  return fetch(url.toString(), {
    method: 'POST',
    headers: {
      'User-Agent': getUserAgent(),
    },
  });
}

/**
 *
 * @param subscriber
 * @returns
 */
export async function postSubscriber(subscriber: Subscriber): Promise<SubscribeResult> {
  const logger = createLogger('subscriber');

  if (process.env.KLASS_STATIC_SUBSCRIBER === 'true') {
    logger.warn('Using static mock data for subscriber');
    const exists = subscribersMock.some(
      (s) => s.email === subscriber.email && s.classificationId === subscriber.classificationId,
    );
    if (exists) {
      return {
        code: SubscribeStatus.Exists,
        message: localization.classification.subscribeAlready,
        dataColor: ValidationMessageColors.Warning,
      };
    }
    return {
      code: SubscribeStatus.Created,
      message: localization.classification.subscribeMessage,
      dataColor: ValidationMessageColors.Success,
    };
  }

  try {
    const res = await klassPost(`/api/klass/v1/classifications/${subscriber.classificationId}/trackChanges`, {
      email: subscriber.email,
    });

    const text = await res.text();
    logger.debug({ text, status: res.status }, 'Raw response from trackChanges');
    const body: Partial<SubscribeResult> = text ? JSON.parse(text) : {};

    if (res.status === 400 && body.code === SubscribeStatus.Exists) {
      logger.info({ classificationId: subscriber.classificationId }, 'Email already subscribed');
      return {
        code: SubscribeStatus.Exists,
        message: localization.classification.subscribeAlready,
        dataColor: ValidationMessageColors.Warning,
      };
    }

    if (res.status === 500) {
      logger.error({ classificationId: subscriber.classificationId }, 'Email problem during subscription');
      return {
        code: SubscribeStatus.Error,
        message: localization.classification.subscribeError,
        dataColor: ValidationMessageColors.Danger,
      };
    }

    if (!res.ok) {
      logger.error({ statusCode: res.status }, 'Failed to subscribe to classification changes');
      throw new Error(`Failed to subscribe: ${res.status}`);
    }

    logger.info({ classificationId: subscriber.classificationId }, 'Subscribed to classification changes');
    return {
      code: SubscribeStatus.Created,
      message: localization.classification.subscribeMessage,
      dataColor: ValidationMessageColors.Success,
    };
  } catch (error: unknown) {
    logger.error({ error: String(error) }, 'Unexpected error during subscription');
    throw error;
  }
}
