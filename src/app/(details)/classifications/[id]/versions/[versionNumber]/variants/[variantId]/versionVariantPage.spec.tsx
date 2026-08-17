import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('next/navigation', () => ({ notFound: mocks.notFound }));
vi.mock('@/app/(details)/classifications/components/views/VariantView', () => ({ default: vi.fn() }));

describe('VersionVariantPage', () => {
  it('passes parsed route parameters and a versioned back link to the variant view', async () => {
    const { default: VersionVariantPage } = await import('./page');
    const element = await VersionVariantPage({
      params: Promise.resolve({ id: '104', versionNumber: '10', variantId: '42' }),
    });

    expect(element.props).toMatchObject({
      classificationId: 104,
      versionId: 10,
      variantId: 42,
      backHref: '/classifications/104/versions/10/variants',
    });
  });

  it.each([
    { id: 'invalid', versionNumber: '10', variantId: '42' },
    { id: '104', versionNumber: 'invalid', variantId: '42' },
    { id: '104', versionNumber: '10', variantId: 'invalid' },
  ])('returns not found for invalid parameters', async (params) => {
    const { default: VersionVariantPage } = await import('./page');

    await expect(VersionVariantPage({ params: Promise.resolve(params) })).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
