import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { notFound } from 'next/navigation';
import { NuqsTestingAdapter, type UrlUpdateEvent } from 'nuqs/adapters/testing';
import type { ComponentProps } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTimelineData } from '@/components/data-coverage-timeline';
import DataCoverageTimeline from '@/components/data-coverage-timeline/dataCoverageTimeline';
import type { TimelineItem } from '@/components/data-coverage-timeline/types';
import type { TimelineData } from '@/components/data-coverage-timeline/useTimelineData';
import { DetailsList } from '@/components/details-list';
import type { DaplaDataFileDTO, DatasetDTO, DatasetVariableDTO } from '@/libs/data-access/datadoc';
import { PeriodFormat } from '@/libs/data-access/datadoc';
import { listDatasetVariableDataFilePaths, listDatasetVariableIdsInPeriod } from './actions';
import DatasetVariableWorkspace from './DatasetVariableWorkspace';
import styles from './dataset-page.module.css';
import DatasetDetailShell from './datasetDetail';

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
  default: vi.fn(
    ({
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
        data-selected-period-range={
          selectedPeriodRange ? `${selectedPeriodRange.start}:${selectedPeriodRange.end}` : ''
        }
      />
    ),
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
  DetailsList: vi.fn(() => null),
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

function DatasetDetail({
  dataset,
  dataFilesShared,
  dataFilesProduct,
  datasetVariables,
}: {
  dataset: DatasetDTO;
  dataFilesShared: DaplaDataFileDTO[];
  dataFilesProduct: DaplaDataFileDTO[];
  datasetVariables: DatasetVariableDTO[];
}) {
  return (
    <DatasetDetailShell
      dataset={dataset}
      dataFilesShared={dataFilesShared}
      dataFilesProduct={dataFilesProduct}
      workspace={
        <DatasetVariableWorkspace
          datasetId={dataset.id ?? ''}
          dataFilesShared={dataFilesShared}
          dataFilesProduct={dataFilesProduct}
          datasetVariables={datasetVariables}
        />
      }
    />
  );
}

const defaultProps: ComponentProps<typeof DatasetDetail> = {
  dataset,
  dataFilesShared: [sharedFile],
  dataFilesProduct: [productFile],
  datasetVariables: [
    { id: 'variable-1', short_name: 'income' },
    { id: 'variable-2', short_name: 'person_id' },
  ],
};

function renderDatasetDetail(
  overrides: Partial<ComponentProps<typeof DatasetDetail>> = {},
  searchParams = '',
  onUrlUpdate: (event: UrlUpdateEvent) => void = vi.fn(),
) {
  return render(<DatasetDetail {...defaultProps} {...overrides} />, {
    wrapper: ({ children }) => (
      <NuqsTestingAdapter searchParams={searchParams} onUrlUpdate={onUrlUpdate} hasMemory>
        {children}
      </NuqsTestingAdapter>
    ),
  });
}

function selectTimelinePeriod(start: string, end: string) {
  act(() => vi.mocked(DataCoverageTimeline).mock.lastCall?.[0].onSelectPeriod?.({ start, end, label: '' }));
}

describe('DatasetDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.isAuthenticated = true;
    vi.mocked(useTimelineData).mockReturnValue(emptyTimelineData);
    vi.mocked(listDatasetVariableDataFilePaths).mockResolvedValue([]);
    vi.mocked(listDatasetVariableIdsInPeriod).mockResolvedValue([]);
  });

  it('restores search and period filters from the URL', async () => {
    vi.mocked(useTimelineData).mockReturnValue(twoPeriodTimelineData);
    vi.mocked(listDatasetVariableIdsInPeriod).mockResolvedValue(['variable-1']);
    renderDatasetDetail({}, '?q=income&periodFrom=2020-01-01&periodTo=2020-01-31');

    expect(screen.getByText('Søk: «income»')).toBeInTheDocument();
    expect(screen.getByTestId('data-coverage-timeline')).toHaveAttribute(
      'data-selected-period-range',
      '2020-01-01:2020-01-31',
    );
    await waitFor(() => {
      expect(listDatasetVariableIdsInPeriod).toHaveBeenCalledWith('123', '2020-01-01', '2020-01-31');
    });
  });

  it('restores focus to the search filter when the empty-state reset is used', async () => {
    renderDatasetDetail({}, '?q=unknown');
    const resetButtons = screen.getAllByRole('button', { name: 'Nullstill filter' });
    const resetButton = resetButtons.at(-1)!;
    resetButton.focus();
    fireEvent.click(resetButton);

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: 'Ingen variabler matcher «unknown»' })).not.toBeInTheDocument(),
    );
    expect(screen.getByRole('searchbox', { hidden: true }).closest('details')?.querySelector('summary')).toHaveFocus();
  });

  it('does not render dataset details again when filters or their request results change', async () => {
    vi.mocked(useTimelineData).mockReturnValue(twoPeriodTimelineData);
    renderDatasetDetail();
    const initialRenderCount = vi.mocked(DetailsList).mock.calls.length;

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'income' } });
    await waitFor(() => expect(listDatasetVariableDataFilePaths).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.getByTestId('dataset-periods-and-variables')).toHaveAttribute('aria-busy', 'false'),
    );

    expect(DetailsList).toHaveBeenCalledTimes(initialRenderCount);
  });

  it('focuses the sidebar toggle when resetting empty results with the sidebar collapsed', async () => {
    renderDatasetDetail({}, '?q=unknown');
    const toggle = screen.getByRole('button', { name: 'Skjul filterpanelet' });
    fireEvent.click(toggle);
    const reset = screen.getByRole('button', { name: 'Nullstill filter' });
    reset.focus();
    fireEvent.click(reset);

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: 'Ingen variabler matcher «unknown»' })).not.toBeInTheDocument(),
    );
    expect(toggle).toHaveFocus();
  });

  it.each([
    'periodFrom=invalid&periodTo=2020-01-31',
    'periodFrom=2020-02-01&periodTo=2020-01-31',
    'periodFrom=2020-01-01',
    'periodTo=2020-01-31',
    'periodFrom=2019-01-01&periodTo=2019-01-31',
  ])('ignores an unavailable or invalid period without rewriting the URL: %s', async (params) => {
    vi.mocked(useTimelineData).mockReturnValue(twoPeriodTimelineData);
    const onUrlUpdate = vi.fn();
    renderDatasetDetail({}, `?${params}`, onUrlUpdate);

    expect(screen.getByTestId('data-coverage-timeline')).toHaveAttribute('data-selected-period-range', '');
    await act(() => new Promise((resolve) => setTimeout(resolve, 300)));
    expect(listDatasetVariableIdsInPeriod).not.toHaveBeenCalled();
    expect(onUrlUpdate).not.toHaveBeenCalled();
  });

  it('updates both period boundaries together and resets only dataset filter parameters', async () => {
    vi.mocked(useTimelineData).mockReturnValue(twoPeriodTimelineData);
    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    renderDatasetDetail({}, '?q=income&other=keep', onUrlUpdate);
    selectTimelinePeriod('2020-01-01', '2020-01-31');

    await waitFor(() => {
      const params = onUrlUpdate.mock.calls.at(-1)?.[0].searchParams;
      expect(params?.get('periodFrom')).toBe('2020-01-01');
      expect(params?.get('periodTo')).toBe('2020-01-31');
      expect(params?.get('q')).toBe('income');
    });
    fireEvent.click(screen.getByRole('button', { name: 'Nullstill filter' }));
    await waitFor(() => {
      const params = onUrlUpdate.mock.calls.at(-1)?.[0].searchParams;
      expect(params?.has('q')).toBe(false);
      expect(params?.has('periodFrom')).toBe(false);
      expect(params?.has('periodTo')).toBe(false);
      expect(params?.get('other')).toBe('keep');
    });
  });

  it('updates search and dropdown filters and clears the full-range selection', async () => {
    vi.mocked(useTimelineData).mockReturnValue(twoPeriodTimelineData);
    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    renderDatasetDetail({}, '', onUrlUpdate);
    fireEvent.click(screen.getByRole('button', { name: 'Filtrer på navn' }));
    fireEvent.change(screen.getByRole('searchbox', { name: 'Filtrer på navn' }), { target: { value: 'income' } });
    await waitFor(() => expect(onUrlUpdate.mock.calls.at(-1)?.[0].searchParams.get('q')).toBe('income'));

    fireEvent.click(screen.getByRole('button', { name: 'Periode' }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Til' }), { target: { value: '0' } });
    await waitFor(() => {
      expect(onUrlUpdate.mock.calls.at(-1)?.[0].searchParams.get('periodTo')).toBe('2020-01-31');
    });
    fireEvent.change(screen.getByRole('combobox', { name: 'Til' }), { target: { value: '1' } });
    await waitFor(() => {
      const params = onUrlUpdate.mock.calls.at(-1)?.[0].searchParams;
      expect(params?.has('periodFrom')).toBe(false);
      expect(params?.has('periodTo')).toBe(false);
      expect(params?.get('q')).toBe('income');
    });
  });

  it('keeps URL period boundaries selected when older periods are added', () => {
    vi.mocked(useTimelineData).mockReturnValue(twoPeriodTimelineData);
    const { rerender } = renderDatasetDetail({}, '?periodFrom=2020-02-01&periodTo=2020-02-29');
    vi.mocked(useTimelineData).mockReturnValue({
      ...twoPeriodTimelineData,
      years: [2019, 2020],
      slots: {
        ...twoPeriodTimelineData.slots,
        2019: [{ start: '2019-12-01', end: '2019-12-31', label: 'des' }],
      },
    });
    rerender(<DatasetDetail {...defaultProps} />);
    expect(screen.getByTestId('data-coverage-timeline')).toHaveAttribute(
      'data-selected-period-range',
      '2020-02-01:2020-02-29',
    );
  });

  it('ignores URL filters when variable filtering is unavailable', async () => {
    auth.isAuthenticated = false;
    vi.mocked(useTimelineData).mockReturnValue(twoPeriodTimelineData);
    renderDatasetDetail({}, '?q=income&periodFrom=2020-01-01&periodTo=2020-01-31');
    expect(screen.getByTestId('data-coverage-timeline')).toHaveAttribute('data-selected-period-range', '');
    await act(() => new Promise((resolve) => setTimeout(resolve, 300)));
    expect(listDatasetVariableIdsInPeriod).not.toHaveBeenCalled();
    expect(listDatasetVariableDataFilePaths).not.toHaveBeenCalled();
  });

  it('renders one type with the logical type preferred and physical storage details underneath', () => {
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
      {
        id: 'variable-3',
        short_name: 'unknown_type',
      },
    ] as DatasetVariableDTO[];

    renderDatasetDetail({ datasetVariables });

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Example dataset');
    expect(screen.getAllByRole('heading', { name: 'Variabler' })).toHaveLength(1);
    expect(screen.getByText(sharedFile.file_path!)).toBeDefined();
    expect(screen.getByText(productFile.file_path!)).toBeDefined();
    expect(screen.queryByRole('heading', { name: 'Variabler i datasettet' })).toBeNull();
    expect(screen.getByText('income', { selector: 'code' })).toBeDefined();
    expect(screen.getByText('person_id', { selector: 'code' })).toBeDefined();
    expect(screen.queryByTestId('dataset-variable-details-card')).toBeNull();
    const variableItems = screen.getAllByTestId(/^dataset-variable-card-/);
    expect(variableItems).toHaveLength(3);
    expect(variableItems.map((item) => item.tagName)).toEqual(['LI', 'LI', 'LI']);
    expect(screen.getByTestId('dataset-periods-and-variables')).toContainElement(
      screen.getByTestId('dataset-variable-card-variable-1'),
    );
    expect(screen.getAllByText('Type', { selector: 'dt' })).toHaveLength(3);
    expect(screen.getByText('Lagret som 64-bits heltall')).toBeDefined();
    expect(screen.getByText('Desimaltall')).toBeDefined();
    expect(screen.getByText('Desimaltall')).toHaveClass(styles.variableTypeMagic ?? 'variableTypeMagic');
    expect(screen.getByText('Bytearray')).toBeDefined();
    expect(screen.getByText('–', { selector: 'span[aria-hidden="true"]' })).toBeDefined();
    expect(screen.getByText('Ikke oppgitt')).toHaveClass('ds-sr-only');
    expect(notFound).not.toHaveBeenCalled();
  });

  it('filters variables by name and limits the timeline to matching variable periods', async () => {
    vi.mocked(useTimelineData).mockReturnValue({
      ...twoPeriodTimelineData,
      slots: { 2020: [] },
    });
    vi.mocked(listDatasetVariableDataFilePaths).mockResolvedValue([productFile.file_path]);

    renderDatasetDetail();

    fireEvent.click(screen.getByRole('button', { name: 'Filtrer på navn' }));
    expect(screen.getByRole('searchbox', { name: 'Filtrer på navn' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Nullstill filter' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Skjul filterpanelet' }));
    expect(screen.queryByRole('searchbox', { name: 'Filtrer på navn' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Vis filterpanelet' }));
    fireEvent.click(screen.getByRole('button', { name: 'Filtrer på navn' }));
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

    fireEvent.click(screen.getByRole('button', { name: 'Periode' }));
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

  it('selects a single period when a timeline period is clicked', async () => {
    vi.mocked(useTimelineData).mockReturnValue(twoPeriodTimelineData);
    vi.mocked(listDatasetVariableIdsInPeriod).mockResolvedValue(['variable-1']);

    renderDatasetDetail();
    selectTimelinePeriod('2020-01-01', '2020-01-31');

    await waitFor(() => {
      expect(listDatasetVariableIdsInPeriod).toHaveBeenCalledWith('123', '2020-01-01', '2020-01-31');
      expect(screen.getByText('income', { selector: 'code' })).toBeInTheDocument();
      expect(screen.queryByText('person_id', { selector: 'code' })).not.toBeInTheDocument();
    });

    selectTimelinePeriod('2020-01-01', '2020-01-31');

    expect(screen.getByText('person_id', { selector: 'code' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Nullstill filter' })).not.toBeInTheDocument();
  });

  it('toggles a whole year without clearing the name search', async () => {
    vi.mocked(useTimelineData).mockReturnValue({
      ...twoPeriodTimelineData,
      slots: {
        2020: [
          { start: '2020-01-01', end: '2020-06-30', label: 'H1' },
          { start: '2020-07-01', end: '2020-12-31', label: 'H2' },
        ],
      },
    });
    vi.mocked(listDatasetVariableIdsInPeriod).mockResolvedValue(['variable-1']);
    renderDatasetDetail();
    fireEvent.click(screen.getByRole('button', { name: 'Filtrer på navn' }));
    fireEvent.change(screen.getByRole('searchbox', { name: 'Filtrer på navn' }), { target: { value: 'income' } });
    selectTimelinePeriod('2020-01-01', '2020-12-31');
    await waitFor(() => {
      expect(listDatasetVariableIdsInPeriod).toHaveBeenCalledWith('123', '2020-01-01', '2020-12-31');
    });
    selectTimelinePeriod('2020-01-01', '2020-12-31');
    expect(screen.getByTestId('data-coverage-timeline')).toHaveAttribute('data-selected-period-range', '');
    expect(screen.getByRole('searchbox', { name: 'Filtrer på navn' })).toHaveValue('income');
  });

  it.each([
    { isAuthenticated: false, datasetVariables: defaultProps.datasetVariables, scenario: 'unauthenticated users' },
    { isAuthenticated: true, datasetVariables: [], scenario: 'datasets without variables' },
  ])('disables timeline selection for $scenario', ({ isAuthenticated, datasetVariables }) => {
    auth.isAuthenticated = isAuthenticated;
    vi.mocked(useTimelineData).mockReturnValue(twoPeriodTimelineData);

    renderDatasetDetail({ datasetVariables });

    expect(vi.mocked(DataCoverageTimeline).mock.lastCall?.[0].onSelectPeriod).toBeUndefined();
    expect(screen.getByTestId('data-coverage-timeline')).toBeInTheDocument();
    expect(screen.getByTestId('data-coverage-timeline')).toHaveAttribute('data-selected-period-range', '');
    expect(listDatasetVariableIdsInPeriod).not.toHaveBeenCalled();
  });

  it('cancels a pending period variable request when authentication is lost', async () => {
    vi.mocked(useTimelineData).mockReturnValue(twoPeriodTimelineData);
    const { rerender } = renderDatasetDetail();
    selectTimelinePeriod('2020-01-01', '2020-01-31');

    auth.isAuthenticated = false;
    rerender(<DatasetDetail {...defaultProps} />);

    await act(() => new Promise((resolve) => setTimeout(resolve, 300)));

    expect(listDatasetVariableIdsInPeriod).not.toHaveBeenCalled();
    expect(vi.mocked(DataCoverageTimeline).mock.lastCall?.[0].onSelectPeriod).toBeUndefined();
    expect(screen.getByTestId('dataset-periods-and-variables')).toHaveAttribute('aria-busy', 'false');
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
