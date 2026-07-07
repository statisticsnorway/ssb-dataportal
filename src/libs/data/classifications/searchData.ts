import { SearchApi, SearchRequest } from '@/libs/data-access/klass/apis/SearchApi';
import { KlassPagedResourcesSearchResultResource } from '@/libs/data-access/klass/models/KlassPagedResourcesSearchResultResource';
import {
  SearchResultResource,
  SearchResultResourceFromJSON,
} from '@/libs/data-access/klass/models/SearchResultResource';
import { Configuration, ConfigurationParameters, ResponseError } from '@/libs/data-access/klass/runtime';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import classificationsMock from '@/static-data/classifications.json';
import searchResultsMock from '@/static-data/klass-search-results.json';
import { getUserAgent } from '@/utils/userAgent';

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
