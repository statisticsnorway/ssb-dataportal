import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  fetchVariantForClassification: vi.fn(),
  getRequestLanguage: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('@/app/(details)/classifications/[id]/layout', () => ({
  getRequestLanguage: mocks.getRequestLanguage,
}));

vi.mock('@/libs/data/classifications/variantsData', () => ({
  fetchVariantForClassification: mocks.fetchVariantForClassification,
}));

vi.mock('next/navigation', () => ({ notFound: mocks.notFound }));

vi.mock('@/components/details-list', () => ({
  DetailsList: ({ content }: { content: Array<{ label: string; value: React.ReactNode }> }) => (
    <dl>
      {content.map(({ label, value }) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  ),
}));

vi.mock('./CodesView', () => ({
  CodesView: () => <div data-testid='codes-view' />,
}));

describe('VariantView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getRequestLanguage.mockResolvedValue('nb');
  });

  it('fetches and renders a variant within its classification and version', async () => {
    mocks.fetchVariantForClassification.mockResolvedValue({
      id: 42,
      name: 'Testvariant - variant av Test',
      owningSection: '320',
      classificationItems: [],
    });
    const { default: VariantView } = await import('./VariantView');

    render(
      await VariantView({
        classificationId: 104,
        variantId: 42,
        versionId: 10,
        backHref: '/classifications/104/version/10/variants',
      }),
    );

    expect(mocks.fetchVariantForClassification).toHaveBeenCalledWith(104, 42, 'nb', 10);
    expect(screen.getByRole('link', { name: /^Tilbake$/ })).toHaveAttribute(
      'href',
      '/classifications/104/version/10/variants',
    );
    expect(screen.getByRole('heading', { name: 'Test' })).toBeVisible();
    expect(screen.getByTestId('codes-view')).toBeVisible();
  });

  it('returns not found when the variant does not belong to the selected classification', async () => {
    mocks.fetchVariantForClassification.mockResolvedValue(undefined);
    const { default: VariantView } = await import('./VariantView');

    await expect(
      VariantView({ classificationId: 2003, variantId: 42, backHref: '/classifications/2003/variants' }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(mocks.notFound).toHaveBeenCalled();
  });
});
