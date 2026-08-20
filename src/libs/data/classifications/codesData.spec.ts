import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { CodesApi } from '@/libs/data-access/klass';
import { VersionsApi } from '@/libs/data-access/klass/apis/VersionsApi';
import { ResponseError } from '@/libs/data-access/klass/runtime';
import codesMock from '@/static-data/codes-mock.json';
import { fetchChanges, fetchChangesDownload, fetchCodesDownload, fetchVersionCodes } from './codesData';

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

describe('fetchChanges', () => {
  it('returns static mock data when KLASS_USE_STATIC_DATA is true', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');

    const result = await fetchChanges(646, new Date(), undefined);

    expect(result[0]?.newName).toEqual('Belarus');
  });
  it('returns empty array for an unknown version id in static mode', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');

    const result = await fetchChanges(9999, new Date(), undefined);

    expect(result).toEqual([]);
  });
  it('returns empty array when the API has no changes for a classification', async () => {
    process.env.KLASS_USE_STATIC_DATA = 'false';

    vi.spyOn(CodesApi.prototype, 'changes').mockRejectedValue(
      new ResponseError(new Response(null, { status: 404 }), 'Not found'),
    );

    await expect(fetchChanges(7, new Date(), undefined)).resolves.toEqual([]);
  });
  it('logs and rethrows an unexpected non-response error', async () => {
    process.env.KLASS_USE_STATIC_DATA = 'false';

    vi.spyOn(CodesApi.prototype, 'changes').mockRejectedValue(new Error('Network failure'));

    await expect(fetchChanges(646, new Date(), undefined)).rejects.toThrow('Network failure');
  });
});

describe('fetchChangesDownload', () => {
  it('returns static mock data as json when KLASS_USE_STATIC_DATA is true', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');

    const result = await fetchChangesDownload({
      classificationId: 91,
      from: new Date('2020-01-01'),
      to: undefined,
      language: 'nb',
      format: 'csv',
    });

    expect(result.mimeType).toBe('application/json');
    expect(result.content).toContain('Belarus');
  });
});

describe('fetchCodesDownload', () => {
  it('builds csv from json codes to preserve unicode characters', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'false');

    const codesSpy = vi.spyOn(CodesApi.prototype, 'codes').mockResolvedValue({
      codes: [
        {
          code: '1853',
          parentCode: undefined,
          level: '1',
          name: 'Evenes - Evenášši',
          shortName: '',
          presentationName: '',
          validFrom: undefined,
          validTo: undefined,
          notes: '',
        },
      ],
    });
    const codesRawSpy = vi.spyOn(CodesApi.prototype, 'codesRaw');

    const result = await fetchCodesDownload({
      versionId: 1,
      classificationId: 131,
      from: new Date('2020-01-01'),
      language: 'nb',
      format: 'csv',
    });

    expect(result.mimeType).toContain('text/csv');
    expect(codesSpy).toHaveBeenCalledOnce();
    expect(codesRawSpy).not.toHaveBeenCalled();
    expect(result.content).toContain('Evenes - Evenášši');
  });
});
