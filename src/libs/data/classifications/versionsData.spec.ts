import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { VersionsApi } from '@/libs/data-access/klass/apis/VersionsApi';
import { ResponseError } from '@/libs/data-access/klass/runtime';
import codesMock from '@/static-data/codes-mock.json';
import { fetchVersionById } from './versionsData';

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

describe('fetchVersionById', () => {
  it('returns static mock data when KLASS_USE_STATIC_DATA is true', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');

    const result = await fetchVersionById(363);

    const expected = codesMock.versionCodes['1'];
    expect(result).toEqual(expected);
  });

  it('returns empty array for an unknown version id in static mode', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');

    await expect(fetchVersionById(9999)).rejects.toThrow('Version with id=9999 not found in static data');
  });

  it('logs and rethrows a ResponseError', async () => {
    process.env.KLASS_USE_STATIC_DATA = 'false';

    vi.spyOn(VersionsApi.prototype, 'versions').mockRejectedValue(
      new ResponseError(new Response(null, { status: 404 }), 'Not found'),
    );

    await expect(fetchVersionById(42)).rejects.toThrow('Not found');
  });

  it('logs and rethrows an unexpected non-response error', async () => {
    process.env.KLASS_USE_STATIC_DATA = 'false';

    vi.spyOn(VersionsApi.prototype, 'versions').mockRejectedValue(new Error('Network failure'));

    await expect(fetchVersionById(1)).rejects.toThrow('Network failure');
  });
});
