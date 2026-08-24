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
  CorrespondenceTable: ({ downloadHref }: { downloadHref: string }) => (
    <div data-testid='correspondence-table' data-download-href={downloadHref} />
  ),
}));

describe('CorrespondencePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getRequestLanguage.mockResolvedValue('nb');
    mocks.fetchVersionById.mockResolvedValue({
      id: 3218,
      validFrom: new Date('2025-01-01'),
      correspondenceTables: [{ id: 2919 }],
    });
    mocks.fetchCorrespondenceTable.mockResolvedValue({
      name: 'Testkorrespondanse',
      id: 2919,
      owningSection: '320',
      contactPerson: { name: 'Ola Nordmann' },
      description: 'Testbeskrivelse',
      source: 'Fra-kodeliste',
      target: 'Til-kodeliste',
      correspondenceMaps: [],
    });
  });

  it('links back to the correspondences tab for the selected version', async () => {
    const { default: CorrespondencePage } = await import('./page');
    const { container } = render(
      await CorrespondencePage({
        params: Promise.resolve({ id: '6', versionNumber: '3218', correspondenceId: '2919' }),
      }),
    );
    expect(screen.getByRole('link', { name: /^Tilbake$/ })).toHaveAttribute(
      'href',
      buildUrl({ classificationId: 6, versionId: 3218, tab: 'correspondences' }),
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Testkorrespondanse' })).toBeVisible();
    expect(screen.getByText('ID')).toBeVisible();
    expect(screen.getByText('2919')).toBeVisible();
    expect(screen.getByText('Eierseksjon')).toBeVisible();
    expect(screen.getByText('320')).toBeVisible();
    expect(screen.getByText('Ansvarlig')).toBeVisible();
    expect(screen.getByText('Ola Nordmann')).toBeVisible();
    expect(screen.queryByText('Gyldig fra og med')).not.toBeInTheDocument();
    expect(screen.queryByText('Beskrivelse')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Koder' })).toBeVisible();
    expect(container.querySelector('main')).not.toBeInTheDocument();
    expect(screen.getByTestId('correspondence-table')).toHaveAttribute(
      'data-download-href',
      '/classifications/6/versions/3218/correspondences/2919/download?v=1&format=csv&language=nb',
    );
  });

  it.each([
    { id: 'invalid', versionNumber: '3218', correspondenceId: '2919' },
    { id: '6', versionNumber: 'invalid', correspondenceId: '2919' },
    { id: '6', versionNumber: '3218', correspondenceId: 'invalid' },
    { id: '6', versionNumber: '3218', correspondenceId: '1.5' },
    { id: '6', versionNumber: '3218', correspondenceId: '0' },
  ])('returns not found for invalid parameters', async (params) => {
    const { default: CorrespondencePage } = await import('./page');
    await expect(CorrespondencePage({ params: Promise.resolve(params) })).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('returns not found without fetching details when the correspondence does not belong to the version', async () => {
    const { default: CorrespondencePage } = await import('./page');
    await expect(
      CorrespondencePage({
        params: Promise.resolve({ id: '6', versionNumber: '3218', correspondenceId: '1253' }),
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(mocks.fetchCorrespondenceTable).not.toHaveBeenCalled();
  });

  it('returns not found when correspondence details are missing', async () => {
    mocks.fetchCorrespondenceTable.mockResolvedValue(undefined);
    const { default: CorrespondencePage } = await import('./page');
    await expect(
      CorrespondencePage({
        params: Promise.resolve({ id: '6', versionNumber: '3218', correspondenceId: '2919' }),
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
