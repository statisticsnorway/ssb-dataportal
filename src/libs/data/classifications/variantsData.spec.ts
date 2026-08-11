import { beforeEach, describe, expect, it, vi } from 'vitest';
import { VariantsApi } from '@/libs/data-access/klass/apis/VariantsApi';
import { fetchClassificationById } from './classificationData';
import { fetchVariantForClassification } from './variantsData';
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
    vi.clearAllMocks();
    vi.stubEnv('KLASS_USE_STATIC_DATA', 'false');
    vi.mocked(fetchClassificationById).mockResolvedValue(classification);
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
