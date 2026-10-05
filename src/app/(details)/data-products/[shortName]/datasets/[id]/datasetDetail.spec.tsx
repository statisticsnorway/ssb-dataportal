import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DaplaDataFileDTO, DatasetDTO } from '@/libs/data-access/datadoc';
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

  it('renders the dataset heading and shared and product files for authenticated users', () => {
    render(<DatasetDetail dataset={dataset} dataFilesShared={[sharedFile]} dataFilesProduct={[productFile]} />);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Example dataset');
    expect(screen.getByText(sharedFile.file_path!)).toBeDefined();
    expect(screen.getByText(productFile.file_path!)).toBeDefined();
    expect(notFound).not.toHaveBeenCalled();
  });

  it('shows only shared files for unauthenticated users', () => {
    auth.isAuthenticated = false;

    render(<DatasetDetail dataset={dataset} dataFilesShared={[sharedFile]} dataFilesProduct={[productFile]} />);

    expect(screen.getByText(sharedFile.file_path!)).toBeDefined();
    expect(screen.queryByText(productFile.file_path!)).toBeNull();
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
