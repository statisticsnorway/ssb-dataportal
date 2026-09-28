import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';

const mocks = vi.hoisted(() => ({
  fetchVariantById: vi.fn(),
  fetchVersionById: vi.fn(),
  fetchClassificationById: vi.fn(),
  resolveDefaultVersion: vi.fn(),
  getRequestLanguage: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('server-only', () => ({}));

vi.mock('@/libs/data/classifications/variantsData', () => ({
  fetchVariantById: mocks.fetchVariantById,
}));

vi.mock('@/libs/data/classifications/classificationData', () => ({
  fetchClassificationById: mocks.fetchClassificationById,
}));

vi.mock('@/app/(details)/classifications/[id]/layout', () => ({
  getRequestLanguage: mocks.getRequestLanguage,
}));

vi.mock('@/libs/data/classifications/versionsData', () => ({
  fetchVersionById: mocks.fetchVersionById,
}));

vi.mock('@/app/(details)/classifications/utils/versionSelection', () => ({
  resolveDefaultVersion: mocks.resolveDefaultVersion,
}));

vi.mock('next/navigation', () => ({
  notFound: mocks.notFound,
}));

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
    mocks.fetchVariantById.mockResolvedValue({
      id: 42,
      name: 'Testvariant - variant av Test',
      owningSection: '320',
      classificationItems: [],
    });

    mocks.fetchVersionById.mockResolvedValue({
      id: 10,
      classificationVariants: [{ id: 42 }],
    });

    const { default: VariantView } = await import('./VariantView');

    render(
      await VariantView({
        classificationId: 104,
        variantId: 42,
        versionId: 10,
        backHref: buildUrl({
          classificationId: 104,
          versionId: 10,
          tab: 'variants',
        }),
      }),
    );

    expect(mocks.fetchVariantById).toHaveBeenCalled();
    expect(mocks.fetchVariantById).toHaveBeenCalledWith(42, 'nb');
    expect(mocks.fetchVersionById).toHaveBeenCalledWith(10, 'nb', true);

    expect(screen.getByRole('heading', { name: 'Testvariant' })).toBeVisible();
    expect(screen.getByTestId('codes-view')).toBeVisible();
  });

  it('uses the route not-found state when the variant does not exist', async () => {
    mocks.fetchVariantById.mockResolvedValue(undefined);

    mocks.fetchVersionById.mockResolvedValue({
      id: 10,
      classificationVariants: [{ id: 42 }],
    });

    const { default: VariantView } = await import('./VariantView');

    await expect(
      VariantView({
        classificationId: 2003,
        variantId: 42,
        versionId: 10,
        backHref: '/',
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.notFound).toHaveBeenCalledTimes(1);
  });

  it('returns notFound when variant does not belong to version', async () => {
    mocks.fetchVariantById.mockResolvedValue({
      id: 42,
      classificationItems: [],
    });

    mocks.fetchVersionById.mockResolvedValue({
      id: 10,
      classificationVariants: [{ id: 99 }],
    });

    const { default: VariantView } = await import('./VariantView');

    await expect(
      VariantView({
        classificationId: 104,
        variantId: 42,
        versionId: 10,
        backHref: '/',
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('uses the default version when versionId is not provided', async () => {
    mocks.fetchVariantById.mockResolvedValue({
      id: 42,
      name: 'Testvariant - variant av Test',
      classificationItems: [],
    });

    mocks.fetchClassificationById.mockResolvedValue({
      versions: [{ id: 20 }],
    });

    mocks.resolveDefaultVersion.mockReturnValue({
      id: 20,
    });

    mocks.fetchVersionById.mockResolvedValue({
      id: 20,
      classificationVariants: [{ id: 42 }],
    });

    const { default: VariantView } = await import('./VariantView');

    await VariantView({
      classificationId: 104,
      variantId: 42,
      backHref: '/',
    });

    expect(mocks.fetchClassificationById).toHaveBeenCalled();
    expect(mocks.resolveDefaultVersion).toHaveBeenCalled();
    expect(mocks.fetchVersionById).toHaveBeenCalledWith(20, 'nb', true);
  });
});
