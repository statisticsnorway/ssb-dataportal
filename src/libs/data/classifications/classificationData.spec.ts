import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { ClassificationsApi } from '@/libs/data-access/klass/apis/ClassificationsApi';
import { SearchApi } from '@/libs/data-access/klass/apis/SearchApi';
import { ResponseError } from '@/libs/data-access/klass/runtime';
import classificationsMock from '@/static-data/classifications.json';
import searchResultsMock from '@/static-data/klass-search-results.json';
import { ClassificationType } from '@/types/classification';
import { getClassification as getStaticClassification } from '@/utils/mock-data';
import {
  fetchAllClassifications,
  fetchClassificationById,
  fetchSearchResult,
  getKlassSearchClient,
} from './classificationData';

vi.mock('server-only', () => ({}));

const ORIGINAL_ENV = process.env;
beforeEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  process.env = { ...ORIGINAL_ENV };
});
afterAll(() => {
  process.env = ORIGINAL_ENV;
});

describe('classification data fetching', () => {
  describe('fetchAllClassifications', () => {
    it('static data', async () => {
      vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');
      const result = await fetchAllClassifications();
      expect(result).toHaveLength(classificationsMock.classifications.length);

      const firstStaticId = classificationsMock.classifications[0]?.id;
      expect(firstStaticId).toBeDefined();
      const firstStaticClassification = getStaticClassification(Number(firstStaticId));
      expect(firstStaticClassification).toBeDefined();
      expect(result).toContainEqual(firstStaticClassification);

      vi.unstubAllEnvs();
    });

    it('mock api call happy path', async () => {
      process.env.KLASS_USE_STATIC_DATA = 'false';

      vi.spyOn(ClassificationsApi.prototype, 'classifications').mockResolvedValue({
        embedded: {
          classifications: [
            {
              id: 1,
              name: 'A',
              classificationType: ClassificationType.Klassifikasjon,
            },
          ],
        },
      });

      await expect(fetchAllClassifications()).resolves.toEqual([
        {
          id: 1,
          name: 'A',
          classificationType: ClassificationType.Klassifikasjon,
        },
      ]);
    });

    it('throws when pagination fetch fails', async () => {
      process.env.KLASS_USE_STATIC_DATA = 'false';

      vi.spyOn(ClassificationsApi.prototype, 'classifications').mockResolvedValue({
        embedded: {
          classifications: [{ id: 1, name: 'A', classificationType: ClassificationType.Klassifikasjon }],
        },
        links: {
          next: { href: 'https://example.com/next-page' },
        },
      });

      vi.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 500 }));

      await expect(fetchAllClassifications()).rejects.toThrow('Failed to fetch classifications page');
    });
  });

  describe('fetchClassificationById', () => {
    it('static data', async () => {
      vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');

      const staticId = classificationsMock.classifications[0]?.id;
      expect(staticId).toBeDefined();

      const expectedStaticClassification = getStaticClassification(Number(staticId));
      expect(expectedStaticClassification).toBeDefined();
      await expect(fetchClassificationById(Number(staticId))).resolves.toEqual(expectedStaticClassification);

      vi.unstubAllEnvs();
    });

    it('throws error when no classification is found', async () => {
      process.env.KLASS_USE_STATIC_DATA = 'false';

      vi.spyOn(ClassificationsApi.prototype, 'classification').mockRejectedValue(
        new ResponseError(new Response(null, { status: 404 }), 'Not found'),
      );

      await expect(fetchClassificationById(999)).rejects.toThrow('Not found');
    });

    it('throws ResponseError for non-404 status codes', async () => {
      process.env.KLASS_USE_STATIC_DATA = 'false';

      vi.spyOn(ClassificationsApi.prototype, 'classification').mockRejectedValue(
        new ResponseError(new Response(null, { status: 500 }), 'Internal Server Error'),
      );

      await expect(fetchClassificationById(1)).rejects.toThrow('Internal Server Error');
    });

    it('mock api call happy path', async () => {
      process.env.KLASS_USE_STATIC_DATA = 'false';

      vi.spyOn(ClassificationsApi.prototype, 'classification').mockResolvedValue({
        id: 1,
        name: 'A',
        classificationType: ClassificationType.Klassifikasjon,
      });

      await expect(fetchClassificationById(1)).resolves.toEqual({
        id: 1,
        name: 'A',
        classificationType: ClassificationType.Klassifikasjon,
      });
    });

    it('throws unexpected non-response errors when fetching by id', async () => {
      process.env.KLASS_USE_STATIC_DATA = 'false';

      vi.spyOn(ClassificationsApi.prototype, 'classification').mockRejectedValue(new Error('Unexpected failure'));

      await expect(fetchClassificationById(1)).rejects.toThrow('Unexpected failure');
    });
  });
});

describe('fetchSearchResult', () => {
  it('configures basePath from KLASS_BASE_PATH', async () => {
    vi.stubEnv('KLASS_BASE_PATH', 'https://klass.example.com/api/klass/v1');
    const client = await getKlassSearchClient();
    expect((client as unknown as { configuration: { basePath: string } }).configuration.basePath).toBe(
      'https://klass.example.com',
    );
    vi.unstubAllEnvs();
  });

  it('returns filtered static data when KLASS_SEARCH_USE_STATIC_DATA is true', async () => {
    vi.stubEnv('KLASS_SEARCH_USE_STATIC_DATA', 'true');

    const firstName = searchResultsMock[0]?.name ?? '';
    const query = firstName.slice(0, 4); // substring guaranteed to match

    const result = await fetchSearchResult({ query, includeCodelists: true });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((r) => r.name?.toLowerCase().includes(query.toLowerCase()))).toBe(true);

    vi.unstubAllEnvs();
  });

  it('returns an empty array when no static result matches', async () => {
    vi.stubEnv('KLASS_SEARCH_USE_STATIC_DATA', 'true');

    await expect(fetchSearchResult({ query: '___definitely-no-match___', includeCodelists: true })).resolves.toEqual(
      [],
    );

    vi.unstubAllEnvs();
  });

  it('excludes codelists when includeCodelists is false', async () => {
    vi.stubEnv('KLASS_SEARCH_USE_STATIC_DATA', 'true');

    const result = await fetchSearchResult({ query: '', includeCodelists: false });
    expect(result.every((r) => !r.name?.startsWith('Kodeliste'))).toBe(true);

    vi.unstubAllEnvs();
  });

  it('returns api results on happy path', async () => {
    process.env.KLASS_SEARCH_USE_STATIC_DATA = 'false';

    vi.spyOn(SearchApi.prototype, 'search').mockResolvedValue({
      embedded: {
        searchResults: [{ id: 1, name: 'A', searchScore: 1 }],
      },
    });

    await expect(fetchSearchResult({ query: 'A' })).resolves.toEqual([{ id: 1, name: 'A', searchScore: 1 }]);
  });

  it('returns an empty array when the api returns no embedded results', async () => {
    process.env.KLASS_SEARCH_USE_STATIC_DATA = 'false';

    vi.spyOn(SearchApi.prototype, 'search').mockResolvedValue({});

    await expect(fetchSearchResult({ query: 'nothing' })).resolves.toEqual([]);
  });

  it('throws when the api call fails', async () => {
    process.env.KLASS_SEARCH_USE_STATIC_DATA = 'false';

    vi.spyOn(SearchApi.prototype, 'search').mockRejectedValue(
      new ResponseError(new Response(null, { status: 500 }), 'Search failed'),
    );

    await expect(fetchSearchResult({ query: 'x' })).rejects.toThrow('Search failed');
  });
  it('logs and rethrows unexpected non-response errors from search', async () => {
    process.env.KLASS_SEARCH_USE_STATIC_DATA = 'false';

    vi.spyOn(SearchApi.prototype, 'search').mockRejectedValue(new Error('Boom'));

    await expect(fetchSearchResult({ query: 'x' })).rejects.toThrow('Boom');
  });
});
