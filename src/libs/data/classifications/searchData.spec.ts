import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchApi } from '@/libs/data-access/klass/apis/SearchApi';
import { ResponseError } from '@/libs/data-access/klass/runtime';
import searchResultsMock from '@/static-data/klass-search-results.json';
import { fetchSearchResult, getKlassSearchClient } from './searchData';

vi.mock('server-only', () => ({}));

const ORIGINAL_ENV = process.env;
beforeEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  process.env = { ...ORIGINAL_ENV };
});
afterEach(() => {
  vi.unstubAllEnvs();
});
afterAll(() => {
  process.env = ORIGINAL_ENV;
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
    vi.stubEnv('KLASS_SEARCH_USE_STATIC_DATA', 'false');

    vi.spyOn(SearchApi.prototype, 'search').mockResolvedValue({
      embedded: {
        searchResults: [{ id: 1, name: 'A', searchScore: 1 }],
      },
    });

    await expect(fetchSearchResult({ query: 'A' })).resolves.toEqual([{ id: 1, name: 'A', searchScore: 1 }]);
  });

  it('returns an empty array when the api returns no embedded results', async () => {
    vi.stubEnv('KLASS_SEARCH_USE_STATIC_DATA', 'false');

    vi.spyOn(SearchApi.prototype, 'search').mockResolvedValue({});

    await expect(fetchSearchResult({ query: 'nothing' })).resolves.toEqual([]);
  });

  it('throws when the api call fails', async () => {
    vi.stubEnv('KLASS_SEARCH_USE_STATIC_DATA', 'false');

    vi.spyOn(SearchApi.prototype, 'search').mockRejectedValue(
      new ResponseError(new Response(null, { status: 500 }), 'Search failed'),
    );

    await expect(fetchSearchResult({ query: 'x' })).rejects.toThrow('Search failed');
  });
  it('logs and rethrows unexpected non-response errors from search', async () => {
    vi.stubEnv('KLASS_SEARCH_USE_STATIC_DATA', 'false');

    vi.spyOn(SearchApi.prototype, 'search').mockRejectedValue(new Error('Boom'));

    await expect(fetchSearchResult({ query: 'x' })).rejects.toThrow('Boom');
  });
});
