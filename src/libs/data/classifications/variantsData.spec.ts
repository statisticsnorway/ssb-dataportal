import { beforeEach, describe, expect, it, vi } from 'vitest';
import { VariantsApi } from '@/libs/data-access/klass/apis/VariantsApi';
import { ResponseError } from '@/libs/data-access/klass/runtime';
import { fetchVariantById, fetchVariantCodesDownload } from './variantsData';

vi.mock('server-only', () => ({}));
vi.mock('./classificationData', () => ({ fetchClassificationById: vi.fn() }));
vi.mock('./versionsData', () => ({ fetchVersionById: vi.fn() }));

const variantResource = {
  id: 3530,
  name: 'Canonical Variant Name',
  classificationItems: [
    {
      code: 'A',
      parentCode: undefined,
      level: '1',
      name: 'Alpha',
      shortName: 'Alpha',
      notes: 'Note',
      validFrom: new Date('2025-01-01'),
      validTo: undefined,
    },
  ],
};

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

  it('returns undefined when the live API cannot find a variant', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'false');
    const error = new ResponseError(new Response(null, { status: 404 }), 'Not found');
    vi.spyOn(VariantsApi.prototype, 'variants').mockRejectedValue(error);

    await expect(fetchVariantById(42)).resolves.toBeUndefined();
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
    vi.spyOn(VariantsApi.prototype, 'variants').mockResolvedValue(variantResource);
  });

  it('returns csv with same header structure as codes tab', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'false');

    const payload = await fetchVariantCodesDownload({
      variantId: 3530,
      language: 'nb',
      format: 'csv',
    });

    const firstLine = payload.content.split('\n')[0];
    expect(firstLine).toBe(
      '"code","parentCode","level","name","shortName","presentationName","validFrom","validTo","validFromInRequestedRange","validToInRequestedRange","notes"',
    );
    expect(payload.mimeType).toContain('text/csv');
  });

  it('returns xml with codeList root and codeItem entries', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'false');

    const payload = await fetchVariantCodesDownload({ variantId: 3530, language: 'nb', format: 'xml' });

    expect(payload.content).toContain('<codeList>');
    expect(payload.content).toContain('<codeItem>');
    expect(payload.mimeType).toContain('application/xml');
  });

  it('returns json content with codes wrapper when requested', async () => {
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'false');

    const payload = await fetchVariantCodesDownload({ variantId: 3530, language: 'nb', format: 'json' });

    expect(payload.content).toContain('"codes"');
    expect(payload.mimeType).toContain('application/json');
  });
});
