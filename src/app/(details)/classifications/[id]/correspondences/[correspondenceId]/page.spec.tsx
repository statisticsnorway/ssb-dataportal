import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';

const mocks = vi.hoisted(() => ({
  fetchCorrespondenceTable: vi.fn(),
  getRequestLanguage: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('next/navigation', () => ({ notFound: mocks.notFound }));
vi.mock('@/app/(details)/classifications/[id]/layout', () => ({
  getRequestLanguage: mocks.getRequestLanguage,
}));
vi.mock('@/libs/data/classifications/correspondencesData', () => ({
  fetchCorrespondenceTable: mocks.fetchCorrespondenceTable,
}));
vi.mock('@/app/(details)/classifications/components/correspondence-table', () => ({
  CorrespondenceTable: ({ downloadHref }: { downloadHref: string }) => (
    <div data-testid='correspondence-table' data-download-href={downloadHref} />
  ),
}));

describe('CorrespondencePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getRequestLanguage.mockResolvedValue('nb');
    mocks.fetchCorrespondenceTable.mockResolvedValue({
      name: 'Testkorrespondanse',
      id: 2919,
      source: 'Fra-kodeliste',
      target: 'Til-kodeliste',
      correspondenceMaps: [],
    });
  });

  it('renders a correspondence table and links back to the overview', async () => {
    const { default: CorrespondencePage } = await import('./page');

    render(await CorrespondencePage({ params: Promise.resolve({ id: '79', correspondenceId: '2919' }) }));

    expect(mocks.fetchCorrespondenceTable).toHaveBeenCalledWith(2919, 'nb');
    expect(screen.getByRole('link', { name: /^Tilbake$/ })).toHaveAttribute(
      'href',
      buildUrl({ classificationId: 79, tab: 'correspondences' }),
    );
    expect(screen.getByRole('heading', { name: 'Testkorrespondanse' })).toBeVisible();
    expect(screen.getByTestId('correspondence-table')).toHaveAttribute(
      'data-download-href',
      '/classifications/79/correspondences/2919/download?v=1&format=csv&language=nb',
    );
  });

  it.each([
    { id: 'invalid', correspondenceId: '2919' },
    { id: '79', correspondenceId: 'invalid' },
  ])('returns not found for invalid parameters', async (params) => {
    const { default: CorrespondencePage } = await import('./page');

    await expect(CorrespondencePage({ params: Promise.resolve(params) })).rejects.toThrow('NEXT_NOT_FOUND');
    expect(mocks.fetchCorrespondenceTable).not.toHaveBeenCalled();
  });

  it('returns not found when the correspondence table does not exist', async () => {
    mocks.fetchCorrespondenceTable.mockResolvedValue(undefined);
    const { default: CorrespondencePage } = await import('./page');

    await expect(
      CorrespondencePage({ params: Promise.resolve({ id: '79', correspondenceId: '2919' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('propagates correspondence table fetch failures', async () => {
    mocks.fetchCorrespondenceTable.mockRejectedValue(new Error('API failed'));
    const { default: CorrespondencePage } = await import('./page');

    await expect(
      CorrespondencePage({ params: Promise.resolve({ id: '79', correspondenceId: '2919' }) }),
    ).rejects.toThrow('API failed');
  });
});
