import { describe, expect, it, vi } from 'vitest';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';

vi.mock('server-only', () => ({}));

const mocks = vi.hoisted(() => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('@/libs/data/classifications/utils', () => ({
  getRequestLanguage: vi.fn().mockResolvedValue('nb'),
}));

vi.mock('next/navigation', () => ({ notFound: mocks.notFound }));
vi.mock('@/app/(details)/classifications/components/views/VariantView', () => ({ default: vi.fn() }));
vi.mock('@/libs/data/classifications/classificationData', () => ({
  fetchClassificationById: vi.fn().mockResolvedValue({ fallbackLanguage: 'nb' }),
}));

vi.mock('@/libs/data/classifications/variantsData', () => ({
  fetchVariantForClassification: vi.fn().mockResolvedValue({ id: 42, name: 'Test', classificationItems: [] }),
}));

describe('VariantPage', () => {
  it('passes parsed route parameters to the variant view', async () => {
    const { default: VariantPage } = await import('./page');
    const element = await VariantPage({ params: Promise.resolve({ id: '104', variantId: '42' }) });

    expect(element.props).toMatchObject({
      classificationId: 104,
      fallbackLanguage: 'nb',
      backHref: buildUrl({ classificationId: 104, tab: 'variants' }),
      variant: expect.objectContaining({ id: 42 }),
    });
  });

  it.each([
    { id: 'invalid', variantId: '42' },
    { id: '104', variantId: 'invalid' },
  ])('returns not found for invalid parameters: $id/$variantId', async (params) => {
    const { default: VariantPage } = await import('./page');

    await expect(VariantPage({ params: Promise.resolve(params) })).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
