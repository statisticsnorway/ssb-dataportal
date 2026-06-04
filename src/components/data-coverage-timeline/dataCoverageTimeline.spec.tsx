import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { type DaplaDataFileDTO, PeriodFormat } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language/src/localization';
import DataCoverageTimeline, { slotOverlapsItem } from './dataCoverageTimeline';
import { type Slot, type TimelineItem } from './types';

type BuildDataFileInput = {
  filePath: string;
  from: Date;
  until: Date;
  periodType: PeriodFormat;
};

const buildDataFile = ({ filePath, from, until, periodType }: BuildDataFileInput): DaplaDataFileDTO => ({
  file_path: filePath,
  naming_standard_violations: [],
  contains_data_from: from,
  contains_data_until: until,
  period_type: periodType,
});

describe('DataCoverageTimeline', () => {
  it('treats YEAR slot as covered when an item spans multiple years', () => {
    const slot: Slot = {
      start: '2019-01-01',
      end: '2019-12-31',
      label: localization.dataCoverageTimeline.labelFullYear,
    };
    const item: TimelineItem = {
      filePath: 'gs://bucket/dataset/ufo-observasjoner_p2018_p2019_v1.parquet',
      periodType: PeriodFormat.YEAR,
      start: '2018-01-01',
      end: '2019-12-31',
    };
    expect(slotOverlapsItem(slot, item)).toBe(true);
  });

  it('renders monthly timeline with present and missing segments', () => {
    const data = [
      buildDataFile({
        filePath: 'gs://bucket/dataset/data_2024_01.parquet',
        from: new Date('2024-01-01'),
        until: new Date('2024-01-31'),
        periodType: PeriodFormat.YEAR_MONTH,
      }),
      buildDataFile({
        filePath: 'gs://bucket/dataset/data_2024_03.parquet',
        from: new Date('2024-03-01'),
        until: new Date('2024-03-31'),
        periodType: PeriodFormat.YEAR_MONTH,
      }),
    ];

    render(<DataCoverageTimeline data={data} />);

    const text = localization.dataCoverageTimeline;
    const janLabel = text.monthsShort[0]!;
    const decLabel = text.monthsShort[11]!;

    expect(screen.getByRole('heading', { name: localization.datasetDetail.dataCoverageTimeline })).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText(janLabel)).toBeInTheDocument();
    expect(screen.getByText(decLabel)).toBeInTheDocument();
  });

  it('returns null for empty data', () => {
    render(<DataCoverageTimeline data={[]} />);

    expect(
      screen.queryByRole('heading', { name: localization.datasetDetail.dataCoverageTimeline }),
    ).not.toBeInTheDocument();
  });

  it('returns null for mixed period types', () => {
    const data = [
      buildDataFile({
        filePath: 'gs://bucket/dataset/month_2024_01.parquet',
        from: new Date('2024-01-01'),
        until: new Date('2024-01-31'),
        periodType: PeriodFormat.YEAR_MONTH,
      }),
      buildDataFile({
        filePath: 'gs://bucket/dataset/q2_2024.parquet',
        from: new Date('2024-04-01'),
        until: new Date('2024-06-30'),
        periodType: PeriodFormat.QUARTER,
      }),
    ];

    render(<DataCoverageTimeline data={data} />);

    expect(
      screen.queryByRole('heading', { name: localization.datasetDetail.dataCoverageTimeline }),
    ).not.toBeInTheDocument();
  });

  it('renders the full year range including years without files', () => {
    const data = [
      buildDataFile({
        filePath: 'gs://bucket/dataset/data_2022_01.parquet',
        from: new Date('2022-01-01'),
        until: new Date('2022-01-31'),
        periodType: PeriodFormat.YEAR_MONTH,
      }),
      buildDataFile({
        filePath: 'gs://bucket/dataset/data_2024_01.parquet',
        from: new Date('2024-01-01'),
        until: new Date('2024-01-31'),
        periodType: PeriodFormat.YEAR_MONTH,
      }),
    ];

    render(<DataCoverageTimeline data={data} />);

    expect(screen.getByText('2022')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
  });
});
