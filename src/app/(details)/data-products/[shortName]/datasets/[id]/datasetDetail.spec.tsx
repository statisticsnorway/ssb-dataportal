import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DaplaDataFileDTO, DatasetDTO, DatasetVariableDTO } from '@/libs/data-access/datadoc';
import DatasetDetail from './datasetDetail';

const auth = vi.hoisted(() => ({
  isAuthenticated: true,
}));

vi.mock('server-only', () => ({}));

vi.mock('@/app/authContext', () => ({
  useAuthContext: () => auth,
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_HTTP_ERROR_FALLBACK;404');
  }),
}));

vi.mock('@/app/(services)/tabs', () => ({
  tabsData: {
    DataProducts: { route: '/data-products' },
  },
}));

vi.mock('@/utils/config', () => ({
  getDaplaCtrlUrl: () => 'http://localhost',
}));

vi.mock('@/components/data-coverage-timeline', () => ({
  useTimelineData: vi.fn(() => ({ isValid: false })),
}));

vi.mock('@/components/data-coverage-timeline/dataCoverageTimeline', () => ({
  default: () => null,
}));

vi.mock('@/components/dataportal-breadcrumbs', () => ({
  DataportalBreadcrumbs: () => null,
}));

vi.mock('@/components/details-list', () => ({
  DetailsList: () => null,
}));

vi.mock('@/components/link-components/externalLink', () => ({
  ExternalLink: () => null,
}));

vi.mock('@/components/tag-components/copy-tag', () => ({
  CopyTag: () => null,
}));

vi.mock('../../components/DataFileSearchHit', () => ({
  DataFileSearchHit: ({ dataFile }: { dataFile: DaplaDataFileDTO }) => (
    <div data-testid='data-file'>{dataFile.file_path}</div>
  ),
}));

const sharedFile = {
  file_name: 'shared-file.parquet',
  file_path: 'shared-file.parquet',
} as DaplaDataFileDTO;

const productFile = {
  file_name: 'product-file.parquet',
  file_path: 'product-file.parquet',
} as DaplaDataFileDTO;

const dataset = {
  id: '123',
  short_description: 'Example dataset',
  product_short_name: 'ufo',
  has_naming_standard_violations: false,
} as DatasetDTO;

describe('DatasetDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.isAuthenticated = true;
  });

  it('renders each variable in its own card with side-by-side type details', () => {
    const datasetVariables = [
      {
        id: 'variable-1',
        short_name: 'income',
        physical_type_name: 'INT64',
        logical_type_name: 'DECIMAL',
      },
      {
        id: 'variable-2',
        short_name: 'person_id',
        physical_type_name: 'BYTE_ARRAY',
        logical_type_name: 'STRING',
      },
    ] as DatasetVariableDTO[];

    render(
      <DatasetDetail
        dataset={dataset}
        dataFilesShared={[sharedFile]}
        dataFilesProduct={[productFile]}
        datasetVariables={datasetVariables}
      />,
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Example dataset');
    expect(screen.getByText(sharedFile.file_path!)).toBeDefined();
    expect(screen.getByText(productFile.file_path!)).toBeDefined();
    expect(screen.getByRole('heading', { name: 'Variabler i datasettet' })).toBeDefined();
    expect(screen.getByRole('heading', { level: 3, name: 'income' })).toBeDefined();
    expect(screen.getByRole('heading', { level: 3, name: 'person_id' })).toBeDefined();
    expect(screen.queryByTestId('dataset-variable-details-card')).toBeNull();
    expect(screen.getAllByTestId(/^dataset-variable-card-/)).toHaveLength(2);
    expect(screen.getByTestId('dataset-periods-and-variables')).toContainElement(
      screen.getByRole('heading', { name: 'Variabler i datasettet' }),
    );
    expect(screen.getAllByText('Fysisk type')).toHaveLength(2);
    expect(screen.getAllByText('Logisk type')).toHaveLength(2);
    expect(screen.getByText('64-bit integer')).toBeDefined();
    expect(screen.getByText('Decimal')).toBeDefined();
    expect(notFound).not.toHaveBeenCalled();
  });

  it('shows only shared files for unauthenticated users', () => {
    auth.isAuthenticated = false;

    render(<DatasetDetail dataset={dataset} dataFilesShared={[sharedFile]} dataFilesProduct={[productFile]} />);

    expect(screen.getByText(sharedFile.file_path!)).toBeDefined();
    expect(screen.queryByText(productFile.file_path!)).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Variabler i datasettet' })).toBeNull();
  });

  it('hides shared files with naming standard violations for unauthenticated users', () => {
    auth.isAuthenticated = false;

    const violatingFile = {
      file_name: 'violating-file.parquet',
      file_path: 'violating-file.parquet',
      naming_standard_violations: ['Invalid file name'],
    } as DaplaDataFileDTO;

    const validFile = {
      file_name: 'valid-file.parquet',
      file_path: 'valid-file.parquet',
      naming_standard_violations: [],
    } as DaplaDataFileDTO;

    render(
      <DatasetDetail
        dataset={dataset}
        dataFilesShared={[sharedFile, validFile, violatingFile]}
        dataFilesProduct={[]}
      />,
    );

    expect(screen.getByText(sharedFile.file_path!)).toBeDefined();
    expect(screen.getByText(validFile.file_path!)).toBeDefined();
    expect(screen.queryByText(violatingFile.file_path!)).toBeNull();
  });

  it('returns 404 for unauthenticated users when the dataset has naming standard violations', () => {
    auth.isAuthenticated = false;

    expect(() =>
      render(
        <DatasetDetail
          dataset={{ ...dataset, has_naming_standard_violations: true }}
          dataFilesShared={[]}
          dataFilesProduct={[]}
        />,
      ),
    ).toThrow('NEXT_HTTP_ERROR_FALLBACK;404');

    expect(notFound).toHaveBeenCalled();
  });

  it('allows authenticated users to view datasets with naming standard violations', () => {
    render(
      <DatasetDetail
        dataset={{ ...dataset, has_naming_standard_violations: true }}
        dataFilesShared={[sharedFile]}
        dataFilesProduct={[]}
      />,
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Example dataset');
    expect(notFound).not.toHaveBeenCalled();
  });
});
