import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type DaplaDataFileDTO, PeriodFormat } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language/src/localization';
import DataCoverageTimeline, { formatAvailableDatasets, slotOverlapsItem } from './dataCoverageTimeline';
import styles from './dataCoverageTimeline.module.css';
import { type Slot, type TimelineItem } from './types';
import { useTimelineData } from './useTimelineData';
import { getFileNameFromFilePath } from './utils';

type BuildDataFileInput = {
  filePath: string;
  from: Date;
  until: Date;
  periodType: PeriodFormat;
};

const buildDataFile = ({ filePath, from, until, periodType }: BuildDataFileInput): DaplaDataFileDTO => ({
  file_path: filePath,
  file_name: getFileNameFromFilePath(filePath),
  naming_standard_violations: [],
  contains_data_from: from,
  contains_data_until: until,
  period_type: periodType,
});

const buildTimelineData = (data: DaplaDataFileDTO[]) => renderHook(() => useTimelineData(data)).result.current;

describe('DataCoverageTimeline', () => {
  afterEach(() => vi.unstubAllGlobals());
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    );
  });

  it('opens mobile file cards grouped by period without a second button or filenames', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    );
    const data = [
      buildDataFile({
        filePath: 'gs://bucket/data.parquet',
        from: new Date('2024-01-01'),
        until: new Date('2024-06-30'),
        periodType: PeriodFormat.HALF_YEAR,
      }),
    ];
    render(<DataCoverageTimeline {...buildTimelineData(data)} />);
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', { name: localization.dataCoverageTimeline.showYear.replace('{year}', '2024') }),
    );
    expect(screen.getByRole('heading', { name: 'H1 2024' })).toBeInTheDocument();
    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.queryByText('data.parquet')).not.toBeInTheDocument();
  });

  it('marks mobile periods with data hidden by the current filters', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    );
    const data = [
      buildDataFile({
        filePath: 'gs://bucket/data.parquet',
        from: new Date('2024-01-01'),
        until: new Date('2024-06-30'),
        periodType: PeriodFormat.HALF_YEAR,
      }),
    ];
    const timeline = buildTimelineData(data);
    const { container } = render(
      <DataCoverageTimeline {...timeline} allItems={[]} unfilteredItems={timeline.allItems} />,
    );

    expect(container.querySelector(`.${styles.mobileFiltered}`)).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', { name: localization.dataCoverageTimeline.showYear.replace('{year}', '2024') }),
    );
    expect(
      screen.getByText(
        localization.dataCoverageTimeline.dataAvailableButFiltered
          .replace('{slotLabel}', 'H1')
          .replace('{year}', '2024'),
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(localization.dataCoverageTimeline.statusDataAvailableButFiltered)).toBeInTheDocument();
  });

  it('collapses long mobile timelines and explains empty years', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    );
    const data = [
      buildDataFile({
        filePath: 'gs://bucket/old.parquet',
        from: new Date('2010-01-01'),
        until: new Date('2010-12-31'),
        periodType: PeriodFormat.YEAR,
      }),
      buildDataFile({
        filePath: 'gs://bucket/new.parquet',
        from: new Date('2025-01-01'),
        until: new Date('2025-12-31'),
        periodType: PeriodFormat.YEAR,
      }),
    ];
    render(<DataCoverageTimeline {...buildTimelineData(data)} />);
    expect(screen.queryByRole('button', { name: /2022/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: localization.datasetDetail.showAllTimelinePeriods })[0]!);
    fireEvent.click(
      screen.getByRole('button', { name: localization.dataCoverageTimeline.showYear.replace('{year}', '2022') }),
    );
    expect(screen.getByText(localization.dataCoverageTimeline.noYearData)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: localization.datasetDetail.showFewerTimelinePeriods }));
    expect(screen.queryByRole('button', { name: /2022/ })).not.toBeInTheDocument();
    expect(screen.queryByText(localization.dataCoverageTimeline.noYearData)).not.toBeInTheDocument();
  });
  it('treats YEAR slot as covered when an item spans multiple years', () => {
    const slot: Slot = {
      start: '2019-01-01',
      end: '2019-12-31',
      label: localization.dataCoverageTimeline.labelFullYear,
    };
    const item: TimelineItem = {
      file_path: 'gs://bucket/dataset/ufo-observasjoner_p2018_p2019_v1.parquet',
      file_name: 'ufo-observasjoner_p2018_p2019_v1.parquet',
      data_file_version: 1,
      periodType: PeriodFormat.YEAR,
      start: '2018-01-01',
      end: '2019-12-31',
      naming_standard_violations: [],
    };
    expect(slotOverlapsItem(slot, item)).toBe(true);
  });

  it('formats available datasets as unique file names', () => {
    const datasets = formatAvailableDatasets([
      'gs://bucket/a/data_p2024-01_v2.parquet',
      'gs://bucket/b/data_p2024-01_v2.parquet',
      'gs://bucket/a/data_p2024-02_v1.parquet',
    ]);

    expect(datasets).toEqual(['data_p2024-01_v2.parquet', 'data_p2024-02_v1.parquet']);
  });

  it('renders monthly timeline with present and missing segments', () => {
    const data = [
      buildDataFile({
        filePath: 'gs://bucket/dataset/data_p2024_01.parquet',
        from: new Date('2024-01-01'),
        until: new Date('2024-01-31'),
        periodType: PeriodFormat.YEAR_MONTH,
      }),
      buildDataFile({
        filePath: 'gs://bucket/dataset/data_p2024_03.parquet',
        from: new Date('2024-03-01'),
        until: new Date('2024-03-31'),
        periodType: PeriodFormat.YEAR_MONTH,
      }),
    ];

    render(<DataCoverageTimeline {...buildTimelineData(data)} />);

    const text = localization.dataCoverageTimeline;
    const janLabel = text.monthsShort[0]!;
    const decLabel = text.monthsShort[11]!;

    expect(screen.getByRole('heading', { name: localization.datasetDetail.dataCoverageTimeline })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: localization.datasetDetail.dataCoverageTimeline })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: text.yearGroupLabel.replace('{year}', '2024') })).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText(janLabel)).toBeInTheDocument();
    expect(screen.getByText(decLabel)).toBeInTheDocument();
    expect(screen.getByText(text.statusDataPresent)).toBeInTheDocument();
    expect(screen.getByText(text.statusMissingTargetSegment)).toBeInTheDocument();
    expect(screen.queryByText(text.statusDataAvailableButFiltered)).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: `${text.tooltipStatusDataPresent}: ${janLabel} 2024. 1 ${text.availableDataFileLabel}`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: `${text.tooltipStatusMissingTargetSegment}: ${text.monthsShort[1]} 2024`,
      }),
    ).toBeInTheDocument();
  });

  it('keeps all timeline cells and grays out periods outside the selected range', () => {
    const data = [
      buildDataFile({
        filePath: 'gs://bucket/dataset/data_p2024_01.parquet',
        from: new Date('2024-01-01'),
        until: new Date('2024-01-31'),
        periodType: PeriodFormat.YEAR_MONTH,
      }),
      buildDataFile({
        filePath: 'gs://bucket/dataset/data_p2024_02.parquet',
        from: new Date('2024-02-01'),
        until: new Date('2024-02-29'),
        periodType: PeriodFormat.YEAR_MONTH,
      }),
      buildDataFile({
        filePath: 'gs://bucket/dataset/data_p2024_03.parquet',
        from: new Date('2024-03-01'),
        until: new Date('2024-03-31'),
        periodType: PeriodFormat.YEAR_MONTH,
      }),
    ];

    const { container } = render(
      <DataCoverageTimeline
        {...buildTimelineData(data)}
        selectedPeriodRange={{ start: '2024-02-01', end: '2024-02-29' }}
      />,
    );

    const cells = Array.from(container.querySelectorAll(`.${styles.cell}`));
    const filledClass = styles.cellFilled ?? 'cellFilled';
    const filteredClass = styles.cellFiltered ?? 'cellFiltered';
    expect(cells).toHaveLength(12);
    expect(cells.slice(0, 3).map((cell) => cell.classList.contains(filledClass))).toEqual([false, true, false]);
    expect(cells.slice(0, 3).map((cell) => cell.classList.contains(filteredClass))).toEqual([true, false, true]);
    expect(
      screen.getByRole('button', {
        name: localization.dataCoverageTimeline.dataAvailableButFiltered
          .replace('{slotLabel}', localization.dataCoverageTimeline.monthsShort[0]!)
          .replace('{year}', '2024'),
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(localization.dataCoverageTimeline.statusDataAvailableButFiltered)).toBeInTheDocument();
  });

  it('returns null for empty data', () => {
    render(<DataCoverageTimeline {...buildTimelineData([])} />);

    expect(
      screen.queryByRole('heading', { name: localization.datasetDetail.dataCoverageTimeline }),
    ).not.toBeInTheDocument();
  });

  it('returns null for mixed period types', () => {
    const data = [
      buildDataFile({
        filePath: 'gs://bucket/dataset/month_p2024_01.parquet',
        from: new Date('2024-01-01'),
        until: new Date('2024-01-31'),
        periodType: PeriodFormat.YEAR_MONTH,
      }),
      buildDataFile({
        filePath: 'gs://bucket/dataset/q2_p2024.parquet',
        from: new Date('2024-04-01'),
        until: new Date('2024-06-30'),
        periodType: PeriodFormat.QUARTER,
      }),
    ];

    render(<DataCoverageTimeline {...buildTimelineData(data)} />);

    expect(
      screen.queryByRole('heading', { name: localization.datasetDetail.dataCoverageTimeline }),
    ).not.toBeInTheDocument();
  });

  it('renders the full year range including years without files', () => {
    const data = [
      buildDataFile({
        filePath: 'gs://bucket/dataset/data_p2022_01.parquet',
        from: new Date('2022-01-01'),
        until: new Date('2022-01-31'),
        periodType: PeriodFormat.YEAR_MONTH,
      }),
      buildDataFile({
        filePath: 'gs://bucket/dataset/data_p2024_01.parquet',
        from: new Date('2024-01-01'),
        until: new Date('2024-01-31'),
        periodType: PeriodFormat.YEAR_MONTH,
      }),
    ];

    render(<DataCoverageTimeline {...buildTimelineData(data)} />);

    expect(screen.getByText('2022')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('shows five year rows and expands the timeline when there are more than five years', () => {
    const data = [
      buildDataFile({
        filePath: 'gs://bucket/dataset/data_p1998_p2025.parquet',
        from: new Date('1998-01-01'),
        until: new Date('2025-12-31'),
        periodType: PeriodFormat.YEAR,
      }),
    ];

    const { container } = render(<DataCoverageTimeline {...buildTimelineData(data)} />);

    const yearLabels = () =>
      Array.from(container.querySelectorAll(`.${styles.yearLabel}`)).map((label) => label.textContent);
    expect(yearLabels()).toEqual(['2025', '2024', '2023', '1999', '1998']);
    expect(screen.queryByText('2022', { exact: true })).not.toBeInTheDocument();

    const expandButtons = screen.getAllByRole('button', { name: localization.datasetDetail.showAllTimelinePeriods });
    expect(expandButtons).toHaveLength(2);
    const expandButton = expandButtons[0]!;
    const middleEllipsisButton = expandButtons[1]!;
    expect(expandButton).toHaveAttribute('aria-expanded', 'false');
    expect(middleEllipsisButton.querySelectorAll(`.${styles.ellipsisDot}`)).toHaveLength(3);
    fireEvent.click(middleEllipsisButton);

    expect(yearLabels()).toHaveLength(28);
    expect(screen.getByText('2022', { exact: true })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: localization.datasetDetail.showFewerTimelinePeriods })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    fireEvent.click(screen.getByRole('button', { name: localization.datasetDetail.showFewerTimelinePeriods }));

    expect(yearLabels()).toEqual(['2025', '2024', '2023', '1999', '1998']);
    expect(screen.getAllByRole('button', { name: localization.datasetDetail.showAllTimelinePeriods })).toHaveLength(2);
    expect(
      screen.getAllByRole('button', { name: localization.datasetDetail.showAllTimelinePeriods })[0],
    ).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not collapse a timeline with five or fewer year rows', () => {
    const data = [
      buildDataFile({
        filePath: 'gs://bucket/dataset/data_p2020_p2024.parquet',
        from: new Date('2020-01-01'),
        until: new Date('2024-12-31'),
        periodType: PeriodFormat.YEAR,
      }),
    ];

    render(<DataCoverageTimeline {...buildTimelineData(data)} />);

    expect(screen.getByText('2020')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: localization.datasetDetail.showAllTimelinePeriods }),
    ).not.toBeInTheDocument();
  });

  it('renders timeline for collected datasets spanning across multiple years', () => {
    const data = [
      buildDataFile({
        filePath: 'gs://bucket/dataset/eksamen_p1998_p2025_v2.parquet',
        from: new Date('1998-01-01T00:00:00'),
        until: new Date('2025-12-31T23:59:59'),
        periodType: PeriodFormat.YEAR,
      }),
      buildDataFile({
        filePath: 'gs://bucket/dataset/eksamen_p1998_p2024_v0.parquet',
        from: new Date('1998-01-01T00:00:00'),
        until: new Date('2024-12-31T23:59:59'),
        periodType: PeriodFormat.YEAR,
      }),
    ];

    render(<DataCoverageTimeline {...buildTimelineData(data)} />);

    expect(screen.getByRole('heading', { name: localization.datasetDetail.dataCoverageTimeline })).toBeInTheDocument();
    expect(screen.getByText('1998')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
  });
});
