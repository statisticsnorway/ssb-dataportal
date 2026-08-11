import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import versionsMock from '@/static-data/versions.json';
import { fetchCorrespondenceTableById, fetchVersionById } from './versionsData';

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

describe('fetchVersion', () => {
  it('returns static mock data when KLASS_USE_STATIC_DATA is true', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');

    const result = await fetchVersionById(91);

    const expected = versionsMock.versions['91'];
    expect(result).toEqual(expected);
  });

  it('returns empty array for an unknown version id in static mode', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');

    const result = await fetchVersionById(999);

    expect(result).toBeUndefined();
  });

  /*
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
  });*/
});

describe('fetchCorrespondenceTableById', () => {
  it('returns correspondence metadata and maps in static mode', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');

    const result = await fetchCorrespondenceTableById(1506);

    expect(result).toMatchObject({
      id: 1506,
      source: 'Landkoder (SSB-3) 2011',
      target: 'Landkoder (SSB-3) 2009',
      correspondenceMaps: expect.arrayContaining([expect.objectContaining({ sourceCode: 'NO', targetCode: 'NO' })]),
    });
  });

  it('returns undefined for an unknown correspondence table in static mode', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');

    await expect(fetchCorrespondenceTableById(999)).resolves.toBeUndefined();
  });
});
