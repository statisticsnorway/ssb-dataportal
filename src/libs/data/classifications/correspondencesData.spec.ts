import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { CorrespondenceTablesApi } from '@/libs/data-access/klass';
import { ResponseError } from '@/libs/data-access/klass/runtime';
import { fetchCorrespondenceDownload, fetchCorrespondenceTable } from './correspondencesData';

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

describe('fetchCorrespondenceDownload', () => {
  it('returns static mock data as json when KLASS_USE_STATIC_DATA is true', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');

    const result = await fetchCorrespondenceDownload({
      tableId: 1506,
      language: 'nb',
      format: 'csv',
    });

    expect(result.mimeType).toBe('application/json');
    expect(result.content).toBe('[]');
  });

  it('uses correspondsRaw with requested format', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'false');

    const correspondenceTablesRawSpy = vi
      .spyOn(CorrespondenceTablesApi.prototype, 'correspondenceTablesRaw')
      .mockResolvedValue({
        raw: new Response('source,target\nA,B', {
          headers: { 'content-type': 'text/csv; charset=utf-8' },
        }),
        value: async () => ({}),
      });

    const result = await fetchCorrespondenceDownload({
      tableId: 1506,
      language: 'en',
      format: 'csv',
    });

    expect(correspondenceTablesRawSpy).toHaveBeenCalledOnce();
    expect(result.mimeType).toContain('text/csv');
    expect(result.content).toContain('source,target');
  });

  it('rethrows response errors', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'false');

    vi.spyOn(CorrespondenceTablesApi.prototype, 'correspondenceTablesRaw').mockRejectedValue(
      new ResponseError(new Response(null, { status: 500 }), 'Failed'),
    );

    await expect(
      fetchCorrespondenceDownload({
        tableId: 1506,
        language: 'nb',
        format: 'json',
      }),
    ).rejects.toThrow('Failed');
  });
});

describe('fetchCorrespondenceTable', () => {
  it('returns a correspondence table from static data', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');

    await expect(fetchCorrespondenceTable(1506, 'nb')).resolves.toMatchObject({
      id: 1506,
      name: expect.any(String),
    });
  });

  it('returns undefined when a static correspondence table is not found', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');

    await expect(fetchCorrespondenceTable(999999, 'nb')).resolves.toBeUndefined();
  });

  it('returns undefined when the correspondence table is not found', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'false');
    vi.spyOn(CorrespondenceTablesApi.prototype, 'correspondenceTables').mockRejectedValue(
      new ResponseError(new Response(null, { status: 404 }), 'Not found'),
    );

    await expect(fetchCorrespondenceTable(1506, 'nb')).resolves.toBeUndefined();
  });

  it('rethrows correspondence table errors other than not found', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'false');
    const error = new ResponseError(new Response(null, { status: 500 }), 'Failed');
    vi.spyOn(CorrespondenceTablesApi.prototype, 'correspondenceTables').mockRejectedValue(error);

    await expect(fetchCorrespondenceTable(1506, 'nb')).rejects.toBe(error);
  });
});
