import { beforeEach, describe, expect, it, vi } from 'vitest';
import { VariantsApi } from '@/libs/data-access/klass/apis/VariantsApi';
import { InitOverrideFunction, ResponseError } from '@/libs/data-access/klass/runtime';
import { fetchClassificationById } from './classificationData';
import { fetchVariantById, fetchVariantCodesDownload, fetchVariantForClassification } from './variantsData';
import { fetchVersionById } from './versionsData';

vi.mock('server-only', () => ({}));
vi.mock('./classificationData', () => ({ fetchClassificationById: vi.fn() }));
vi.mock('./versionsData', () => ({ fetchVersionById: vi.fn() }));

const classification = {
  id: 104,
  versions: [
    { id: 10, validFrom: new Date('2020-01-01') },
    { id: 20, validFrom: new Date('2024-01-01') },
  ],
};

describe('fetchVariantForClassification', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'false');
    vi.mocked(fetchClassificationById).mockResolvedValue(classification);
  });

  it('returns undefined when the classification has no selectable version', async () => {
    vi.mocked(fetchClassificationById).mockResolvedValue({ id: 104, versions: [] });

    await expect(fetchVariantForClassification(104, 200)).resolves.toBeUndefined();
    expect(fetchVersionById).not.toHaveBeenCalled();
  });

  it('returns undefined when the selected version cannot be loaded', async () => {
    vi.mocked(fetchVersionById).mockResolvedValue(undefined);

    await expect(fetchVariantForClassification(104, 200)).resolves.toBeUndefined();
  });

  it('returns a variant from the latest version when no version is specified', async () => {
    vi.mocked(fetchVersionById).mockResolvedValue({
      id: 20,
      classificationVariants: [{ id: 200 }],
    });
    vi.spyOn(VariantsApi.prototype, 'variants').mockResolvedValue({ id: 200, classificationItems: [] });

    await expect(fetchVariantForClassification(104, 200)).resolves.toMatchObject({ id: 200 });
    expect(fetchVersionById).toHaveBeenCalledWith(20, 'nb');
  });

  it('returns a variant from an explicitly selected version', async () => {
    vi.mocked(fetchVersionById).mockResolvedValue({
      id: 10,
      classificationVariants: [{ id: 100 }],
    });
    vi.spyOn(VariantsApi.prototype, 'variants').mockResolvedValue({ id: 100, classificationItems: [] });

    await expect(fetchVariantForClassification(104, 100, 'nb', 10)).resolves.toMatchObject({ id: 100 });
    expect(fetchVersionById).toHaveBeenCalledWith(10, 'nb');
  });

  it('rejects a version that does not belong to the classification', async () => {
    await expect(fetchVariantForClassification(104, 100, 'nb', 999)).resolves.toBeUndefined();
    expect(fetchVersionById).not.toHaveBeenCalled();
  });

  it('rejects a variant that does not belong to the selected version', async () => {
    vi.mocked(fetchVersionById).mockResolvedValue({
      id: 20,
      classificationVariants: [{ id: 200 }],
    });
    const fetchVariant = vi.spyOn(VariantsApi.prototype, 'variants');

    await expect(fetchVariantForClassification(104, 999)).resolves.toBeUndefined();
    expect(fetchVariant).not.toHaveBeenCalled();
  });
});

describe('fetchVariantById', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('returns a variant from static data', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');

    await expect(fetchVariantById(3302)).resolves.toMatchObject({
      id: 3302,
      classificationItems: expect.any(Array),
      levels: expect.any(Array),
    });
  });

  it('returns undefined when a static variant does not exist', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');

    await expect(fetchVariantById(-1)).resolves.toBeUndefined();
  });

  it('returns a variant from the live API', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'false');
    vi.spyOn(VariantsApi.prototype, 'variants').mockResolvedValue({ id: 42, classificationItems: [] });

    await expect(fetchVariantById(42, 'en')).resolves.toMatchObject({ id: 42 });
    expect(VariantsApi.prototype.variants).toHaveBeenCalledWith(
      { id: 42, language: 'EN' },
      expect.objectContaining({ cache: 'force-cache' }),
    );
  });

  it('rethrows API response errors', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'false');
    const error = new ResponseError(new Response(null, { status: 500 }), 'Server error');
    vi.spyOn(VariantsApi.prototype, 'variants').mockRejectedValue(error);

    await expect(fetchVariantById(42)).rejects.toBe(error);
  });

  it('rethrows unexpected errors', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'false');
    const error = new Error('Network failure');
    vi.spyOn(VariantsApi.prototype, 'variants').mockRejectedValue(error);

    await expect(fetchVariantById(42)).rejects.toBe(error);
  });
});

describe('fetchVariantCodesDownload', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('uses variants/{id} endpoint with language and accept header', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'false');
    vi.stubEnv('KLASS_BASE_PATH', 'https://data.ssb.no');

    const variantSpy = vi.spyOn(VariantsApi.prototype, 'variantsRaw').mockResolvedValue({
      raw: new Response('code,name\nA,Alpha', {
        headers: { 'content-type': 'text/csv' },
      }),
      value: vi.fn(),
    });

    await fetchVariantCodesDownload({
      variantId: 3302,
      language: 'NB',
      format: 'csv',
    });

    const [params] = variantSpy.mock.calls[0] ?? [];
    expect(params).toMatchObject({
      id: 3302,
      language: 'NB',
    });

    const [, initOverride] = variantSpy.mock.calls[0] ?? [];
    expect(typeof initOverride).toBe('function');
    const overrideResult = await (initOverride as InitOverrideFunction)({
      init: { method: 'GET', headers: {} },
      context: {
        path: '/api/klass/v1/variants/3302',
        method: 'GET',
        headers: {},
        query: { language: 'NB' },
      },
    });
    expect(overrideResult.headers).toMatchObject({ Accept: 'text/csv' });
  });

  it('returns json content from variants/{id} when requested', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'false');
    vi.stubEnv('KLASS_BASE_PATH', 'https://data.ssb.no');

    const variantSpy = vi.spyOn(VariantsApi.prototype, 'variantsRaw').mockResolvedValue({
      raw: new Response('[]', {
        headers: { 'content-type': 'application/json' },
      }),
      value: vi.fn(),
    });

    const payload = await fetchVariantCodesDownload({ variantId: 3530, language: 'NB', format: 'json' });

    const [params] = variantSpy.mock.calls[0] ?? [];
    expect(params).toMatchObject({ id: 3530, language: 'NB' });
    expect(payload.mimeType).toContain('application/json');
  });
});
