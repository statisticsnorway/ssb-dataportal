import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { notFound } from 'next/navigation';
import type { ComponentProps } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTimelineData } from '@/components/data-coverage-timeline';
import type { TimelineItem } from '@/components/data-coverage-timeline/types';
import type { TimelineData } from '@/components/data-coverage-timeline/useTimelineData';
import type { DaplaDataFileDTO, DatasetDTO, DatasetVariableDTO } from '@/libs/data-access/datadoc';
import { PeriodFormat } from '@/libs/data-access/datadoc';
import { listDatasetVariableDataFilePaths, listDatasetVariableIdsInPeriod } from './actions';
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
  default: ({
    allItems,
    years,
    slots,
    selectedPeriodRange,
  }: {
    allItems: Array<{ file_path: string }>;
    years: number[];
    slots: Record<number, Array<{ label: string }>>;
    selectedPeriodRange?: { start: string; end: string };
  }) => (
    <div
      data-testid='data-coverage-timeline'
      data-file-paths={allItems.map((item) => item.file_path).join(',')}
      data-years={years.join(',')}
      data-period-labels={Object.values(slots)
        .flat()
        .map((slot) => slot.label)
        .join(',')}
      data-selected-period-range={selectedPeriodRange ? `${selectedPeriodRange.start}:${selectedPeriodRange.end}` : ''}
    />
  ),
}));

vi.mock('./actions', () => ({
  listDatasetVariableDataFilePaths: vi.fn(),
  listDatasetVariableIdsInPeriod: vi.fn(),
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

const emptyTimelineData: TimelineData = {
  isValid: false,
  periodType: '',
  allItems: [],
  items: [],
  years: [],
  slots: {},
};

const timelineItems = [
  {
    ...sharedFile,
    data_file_version: 0,
    periodType: PeriodFormat.YEAR_MONTH,
    start: '2020-01-01',
    end: '2020-01-31',
  },
  {
    ...productFile,
    data_file_version: 0,
    periodType: PeriodFormat.YEAR_MONTH,
    start: '2020-02-01',
    end: '2020-02-29',
  },
] as TimelineItem[];

const twoPeriodTimelineData: TimelineData = {
  ...emptyTimelineData,
  isValid: true,
  periodType: PeriodFormat.YEAR_MONTH,
  allItems: timelineItems,
  items: timelineItems,
  years: [2020],
  slots: {
    2020: [
      { start: '2020-01-01', end: '2020-01-31', label: 'jan' },
      { start: '2020-02-01', end: '2020-02-29', label: 'feb' },
    ],
  },
};

const defaultProps: ComponentProps<typeof DatasetDetail> = {
  dataset,
  dataFilesShared: [sharedFile],
  dataFilesProduct: [productFile],
  datasetVariables: [
    { id: 'variable-1', short_name: 'income' },
    { id: 'variable-2', short_name: 'person_id' },
  ],
};

function renderDatasetDetail(overrides: Partial<ComponentProps<typeof DatasetDetail>> = {}) {
  return render(<DatasetDetail {...defaultProps} {...overrides} />);
}

describe('DatasetDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.isAuthenticated = true;
    vi.mocked(useTimelineData).mockReturnValue(emptyTimelineData);
    vi.mocked(listDatasetVariableDataFilePaths).mockResolvedValue([]);
    vi.mocked(listDatasetVariableIdsInPeriod).mockResolvedValue([]);
  });

  it('renders variables in a flat list with two-column type details', () => {
    const datasetVariables = [
      {
        id: 'variable-1',
        short_name: 'income',
        physical_type: 'INT64',
        logical_type: 'DECIMAL',
      },
      {
        id: 'variable-2',
        short_name: 'person_id',
        physical_type: 'BYTE_ARRAY',
      },
    ] as DatasetVariableDTO[];

    renderDatasetDetail({ datasetVariables });

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Example dataset');
    expect(screen.getByText(sharedFile.file_path!)).toBeDefined();
    expect(screen.getByText(productFile.file_path!)).toBeDefined();
    expect(screen.queryByRole('heading', { name: 'Variabler i datasettet' })).toBeNull();
    expect(screen.getByText('income', { selector: 'code' })).toBeDefined();
    expect(screen.getByText('person_id', { selector: 'code' })).toBeDefined();
    expect(screen.queryByTestId('dataset-variable-details-card')).toBeNull();
    const variableItems = screen.getAllByTestId(/^dataset-variable-card-/);
    expect(variableItems).toHaveLength(2);
    expect(variableItems.map((item) => item.tagName)).toEqual(['LI', 'LI']);
    expect(screen.getByTestId('dataset-periods-and-variables')).toContainElement(
      screen.getByTestId('dataset-variable-card-variable-1'),
    );
    expect(screen.getAllByText('Fysisk type', { selector: 'dt' })).toHaveLength(2);
    expect(screen.getAllByText('Logisk type', { selector: 'dt' })).toHaveLength(2);
    expect(screen.getByText('64-bit integer')).toBeDefined();
    expect(screen.getByText('Decimal')).toBeDefined();
    expect(screen.getByText('–')).toBeDefined();
    expect(notFound).not.toHaveBeenCalled();
  });

  it('filters variables by name and limits the timeline to matching variable periods', async () => {
    vi.mocked(useTimelineData).mockReturnValue({
      ...twoPeriodTimelineData,
      slots: { 2020: [] },
    });
    vi.mocked(listDatasetVariableDataFilePaths).mockResolvedValue([productFile.file_path]);

    renderDatasetDetail();

    const filterSummary = screen.getByText('Filtrer');
    const filterDetails = filterSummary.closest('details');
    expect(filterDetails).not.toHaveAttribute('open');
    fireEvent.click(filterSummary);
    expect(filterDetails).toHaveAttribute('open');
    expect(screen.getByRole('heading', { name: 'Søk', level: 3 })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Nullstill filter' })).toBeNull();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Filtrer på navn' }), {
      target: { value: 'person' },
    });

    expect(screen.getByText('person_id', { selector: 'code' })).toBeDefined();
    expect(screen.queryByText('income', { selector: 'code' })).toBeNull();
    expect(screen.getByText('Søk: «person»')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Nullstill filter' })).toBeDefined();
    await waitFor(() => {
      expect(listDatasetVariableDataFilePaths).toHaveBeenCalledWith('123', ['variable-2']);
      expect(screen.getByTestId('data-coverage-timeline')).toHaveAttribute('data-file-paths', productFile.file_path);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Fjern Søk: person' }));
    expect(screen.getByText('income', { selector: 'code' })).toBeDefined();
    expect(screen.getByText('person_id', { selector: 'code' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Nullstill filter' })).toBeNull();
  });

  it('filters the timeline and variables to the selected period range', async () => {
    vi.mocked(useTimelineData).mockReturnValue(twoPeriodTimelineData);
    vi.mocked(listDatasetVariableIdsInPeriod).mockResolvedValue(['variable-1']);

    renderDatasetDetail();

    fireEvent.click(screen.getByText('Filtrer'));
    expect(screen.getByRole('heading', { name: 'Periode', level: 3 })).toBeInTheDocument();
    const maximumPeriodThumb = screen.getByRole('slider', { name: 'Periodeintervall Til' });
    maximumPeriodThumb.focus();
    fireEvent.keyDown(maximumPeriodThumb, { key: 'Home', code: 'Home' });

    await waitFor(() => {
      expect(listDatasetVariableIdsInPeriod).toHaveBeenCalledWith('123', '2020-01-01', '2020-01-31');
      expect(screen.getByText('income', { selector: 'code' })).toBeDefined();
      expect(screen.queryByText('person_id', { selector: 'code' })).toBeNull();
      expect(screen.getByTestId('data-coverage-timeline')).toHaveAttribute(
        'data-file-paths',
        `${sharedFile.file_path},${productFile.file_path}`,
      );
      expect(screen.getByTestId('data-coverage-timeline')).toHaveAttribute('data-period-labels', 'jan,feb');
      expect(screen.getByTestId('data-coverage-timeline')).toHaveAttribute(
        'data-selected-period-range',
        '2020-01-01:2020-01-31',
      );
      expect(screen.getByRole('button', { name: 'Nullstill filter' })).toBeDefined();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Fjern Periode: Jan 2020' }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Nullstill filter' })).toBeNull();
      expect(screen.getByText('person_id', { selector: 'code' })).toBeDefined();
      expect(screen.getByTestId('data-coverage-timeline')).toHaveAttribute('data-selected-period-range', '');
    });
  });

  it('shows only shared files for unauthenticated users', () => {
    auth.isAuthenticated = false;

    renderDatasetDetail({ datasetVariables: [{ id: 'private-variable', short_name: 'internal_only' }] });

    expect(screen.getByText(sharedFile.file_path!)).toBeDefined();
    expect(screen.queryByText(productFile.file_path!)).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Variabler i datasettet' })).toBeNull();
    expect(screen.queryByText('internal_only')).toBeNull();
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

    renderDatasetDetail({
      dataFilesShared: [sharedFile, validFile, violatingFile],
      dataFilesProduct: [],
      datasetVariables: [],
    });

    expect(screen.getByText(sharedFile.file_path!)).toBeDefined();
    expect(screen.getByText(validFile.file_path!)).toBeDefined();
    expect(screen.queryByText(violatingFile.file_path!)).toBeNull();
  });

  it('returns 404 for unauthenticated users when the dataset has naming standard violations', () => {
    auth.isAuthenticated = false;

    expect(() =>
      renderDatasetDetail({
        dataset: { ...dataset, has_naming_standard_violations: true },
        dataFilesShared: [],
        dataFilesProduct: [],
        datasetVariables: [],
      }),
    ).toThrow('NEXT_HTTP_ERROR_FALLBACK;404');

    expect(notFound).toHaveBeenCalled();
  });

  it('allows authenticated users to view datasets with naming standard violations', () => {
    renderDatasetDetail({
      dataset: { ...dataset, has_naming_standard_violations: true },
      dataFilesProduct: [],
      datasetVariables: [],
    });

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Example dataset');
    expect(notFound).not.toHaveBeenCalled();
  });
});
