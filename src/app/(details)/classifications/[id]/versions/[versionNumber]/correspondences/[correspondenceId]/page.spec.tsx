import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';

const mocks = vi.hoisted(() => ({
  fetchCorrespondenceTable: vi.fn(),
  fetchVersionById: vi.fn(),
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
vi.mock('@/libs/data/classifications/versionsData', () => ({ fetchVersionById: mocks.fetchVersionById }));
vi.mock('@/app/(details)/classifications/components/correspondence-table', () => ({
  CorrespondenceTable: () => <div data-testid='correspondence-table' />,
}));

describe('CorrespondencePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getRequestLanguage.mockResolvedValue('nb');
    mocks.fetchVersionById.mockResolvedValue({ id: 3218 });
    mocks.fetchCorrespondenceTable.mockResolvedValue({
      name: 'Testkorrespondanse',
      source: 'Fra-kodeliste',
      target: 'Til-kodeliste',
      correspondenceMaps: [],
    });
  });

  it('links back to the correspondences tab for the selected version', async () => {
    const { default: CorrespondencePage } = await import('./page');

    render(
      await CorrespondencePage({
        params: Promise.resolve({ id: '6', versionNumber: '3218', correspondenceId: '2919' }),
      }),
    );

    expect(screen.getByRole('link', { name: /^Tilbake$/ })).toHaveAttribute(
      'href',
      buildUrl({ classificationId: 6, versionId: 3218, tab: 'correspondences' }),
    );
    expect(screen.getByRole('heading', { name: 'Testkorrespondanse' })).toBeVisible();
    expect(screen.getByTestId('correspondence-table')).toBeVisible();
  });

  it.each([
    { id: 'invalid', versionNumber: '3218', correspondenceId: '2919' },
    { id: '6', versionNumber: 'invalid', correspondenceId: '2919' },
    { id: '6', versionNumber: '3218', correspondenceId: 'invalid' },
  ])('returns not found for invalid parameters', async (params) => {
    const { default: CorrespondencePage } = await import('./page');

    await expect(CorrespondencePage({ params: Promise.resolve(params) })).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
