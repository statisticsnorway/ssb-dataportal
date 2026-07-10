import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { VersionsApi } from '@/libs/data-access/klass/apis/VersionsApi';
import { ResponseError } from '@/libs/data-access/klass/runtime';
import codesMock from '@/static-data/codes-mock.json';
import { fetchVersionCodes } from './codesData';

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

describe('fetchVersionCodes', () => {
  it('returns static mock data when KLASS_USE_STATIC_DATA is true', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');

    const result = await fetchVersionCodes(1);

    const expected = codesMock.versionCodes['1'];
    expect(result).toEqual(expected);
  });

  it('returns empty array for an unknown version id in static mode', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');

    const result = await fetchVersionCodes(9999);

    expect(result).toEqual([]);
  });

  it('maps classificationItems from the API on the happy path', async () => {
    process.env.KLASS_USE_STATIC_DATA = 'false';

    vi.spyOn(VersionsApi.prototype, 'versions').mockResolvedValue({
      classificationItems: [
        { code: 'A', parentCode: undefined, level: '1', name: 'Root', validFrom: new Date('2008-01-01') },
      ],
    });

    const result = await fetchVersionCodes(1);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ code: 'A', level: '1', name: 'Root', parentCode: null });
  });

  it('returns empty array when the API returns no classificationItems', async () => {
    process.env.KLASS_USE_STATIC_DATA = 'false';

    vi.spyOn(VersionsApi.prototype, 'versions').mockResolvedValue({});

    const result = await fetchVersionCodes(1);

    expect(result).toEqual([]);
  });

  it('logs and rethrows a ResponseError', async () => {
    process.env.KLASS_USE_STATIC_DATA = 'false';

    vi.spyOn(VersionsApi.prototype, 'versions').mockRejectedValue(
      new ResponseError(new Response(null, { status: 404 }), 'Not found'),
    );

    await expect(fetchVersionCodes(42)).rejects.toThrow('Not found');
  });

  it('logs and rethrows an unexpected non-response error', async () => {
    process.env.KLASS_USE_STATIC_DATA = 'false';

    vi.spyOn(VersionsApi.prototype, 'versions').mockRejectedValue(new Error('Network failure'));

    await expect(fetchVersionCodes(1)).rejects.toThrow('Network failure');
  });
});
/*
describe('fetchLatestVersionCodes', () => {
  it('returns static mock data when KLASS_USE_STATIC_DATA is true', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');

    const result = await fetchLatestVersionCodes(2003);

    const expected = codesMock.currentCodes['2003'];
    expect(result).toEqual(expected);
  });

  it('returns empty array for an unknown classification id in static mode', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');

    const result = await fetchLatestVersionCodes(9999);

    expect(result).toEqual([]);
  });

  it('resolves the latest version and delegates to fetchVersionCodes', async () => {
    process.env.KLASS_USE_STATIC_DATA = 'false';

    vi.spyOn(ClassificationsApi.prototype, 'classification').mockResolvedValue({
      versions: [
        { id: 10, name: 'v1', validFrom: new Date('2015-01-01') },
        { id: 20, name: 'v2', validFrom: new Date('2022-01-01') },
      ],
    });

    vi.spyOn(VersionsApi.prototype, 'versions').mockResolvedValue({
      classificationItems: [
        { code: 'A', parentCode: undefined, level: '1', name: 'Root', validFrom: new Date('2022-01-01') },
      ],
    });

    const result = await fetchLatestVersionCodes(1);

    // Should have fetched version 20 (most recent validFrom)
    expect(VersionsApi.prototype.versions).toHaveBeenCalledWith(expect.objectContaining({ id: 20 }), expect.anything());
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ code: 'A' });
  });

  it('returns empty array when the classification has no versions', async () => {
    process.env.KLASS_USE_STATIC_DATA = 'false';

    vi.spyOn(ClassificationsApi.prototype, 'classification').mockResolvedValue({
      versions: [],
    });

    const result = await fetchLatestVersionCodes(1);

    expect(result).toEqual([]);
  });

  it('returns empty array when the latest version has no id', async () => {
    process.env.KLASS_USE_STATIC_DATA = 'false';

    vi.spyOn(ClassificationsApi.prototype, 'classification').mockResolvedValue({
      versions: [{ name: 'v1', validFrom: new Date('2020-01-01') }],
    });

    const result = await fetchLatestVersionCodes(1);

    expect(result).toEqual([]);
  });

  it('logs and rethrows a ResponseError from the classification fetch', async () => {
    process.env.KLASS_USE_STATIC_DATA = 'false';

    vi.spyOn(ClassificationsApi.prototype, 'classification').mockRejectedValue(
      new ResponseError(new Response(null, { status: 500 }), 'Server error'),
    );

    await expect(fetchLatestVersionCodes(1)).rejects.toThrow('Server error');
  });

  it('logs and rethrows an unexpected error from the classification fetch', async () => {
    process.env.KLASS_USE_STATIC_DATA = 'false';

    vi.spyOn(ClassificationsApi.prototype, 'classification').mockRejectedValue(new Error('Unexpected'));

    await expect(fetchLatestVersionCodes(1)).rejects.toThrow('Unexpected');
  });
});
*/
