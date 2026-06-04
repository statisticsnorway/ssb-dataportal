import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { type DaplaDataFileDTO, PeriodFormat } from '@/libs/data-access/datadoc';
import { useTimelineData } from './useTimelineData';

type BuildDataFileInput = {
  filePath: string;
  from?: string | Date | null;
  until?: string | Date | null;
  periodType?: PeriodFormat | null;
};

const buildDataFile = ({ filePath, from, until, periodType }: BuildDataFileInput): DaplaDataFileDTO => ({
  file_path: filePath,
  naming_standard_violations: [],
  contains_data_from: (from ?? null) as Date | null,
  contains_data_until: (until ?? null) as Date | null,
  period_type: (periodType ?? null) as PeriodFormat | null,
});

describe('useTimelineData', () => {
  it('returns empty state for empty input', () => {
    const { result } = renderHook(() => useTimelineData([]));

    expect(result.current.isValid).toBe(false);
    expect(result.current.items).toEqual([]);
    expect(result.current.years).toEqual([]);
    expect(result.current.slots).toEqual({});
    expect(result.current.periodType).toBe('');
  });

  it('returns empty state when all items are invalid', () => {
    const data = [
      buildDataFile({
        filePath: 'gs://bucket/dataset/no_period.parquet',
        from: '2024-01-01',
        until: '2024-01-31',
        periodType: null,
      }),
      buildDataFile({
        filePath: 'gs://bucket/dataset/no_dates.parquet',
        periodType: PeriodFormat.YEAR_MONTH,
      }),
    ];

    const { result } = renderHook(() => useTimelineData(data));

    expect(result.current.isValid).toBe(false);
    expect(result.current.items).toEqual([]);
  });

  it('returns empty state for mixed period types', () => {
    const data = [
      buildDataFile({
        filePath: 'gs://bucket/dataset/month_2024_01.parquet',
        from: '2024-01-01',
        until: '2024-01-31',
        periodType: PeriodFormat.YEAR_MONTH,
      }),
      buildDataFile({
        filePath: 'gs://bucket/dataset/q2_2024.parquet',
        from: '2024-04-01',
        until: '2024-06-30',
        periodType: PeriodFormat.QUARTER,
      }),
    ];

    const { result } = renderHook(() => useTimelineData(data));

    expect(result.current.isValid).toBe(false);
  });

  it('returns empty state for overlapping periods', () => {
    const data = [
      buildDataFile({
        filePath: 'gs://bucket/dataset/data_2024_01.parquet',
        from: '2024-01-01',
        until: '2024-01-31',
        periodType: PeriodFormat.YEAR_MONTH,
      }),
      buildDataFile({
        filePath: 'gs://bucket/dataset/data_2024_01_15.parquet',
        from: '2024-01-15',
        until: '2024-02-15',
        periodType: PeriodFormat.YEAR_MONTH,
      }),
    ];

    const { result } = renderHook(() => useTimelineData(data));

    expect(result.current.isValid).toBe(false);
  });

  it('returns empty state for unsupported period type', () => {
    const data = [
      buildDataFile({
        filePath: 'gs://bucket/dataset/week_2024_w01.parquet',
        from: '2024-01-01',
        until: '2024-01-07',
        periodType: PeriodFormat.YEAR_WEEK,
      }),
    ];

    const { result } = renderHook(() => useTimelineData(data));

    expect(result.current.isValid).toBe(false);
  });

  it('parses valid data, sorts items, and generates full year slot range', () => {
    const data = [
      buildDataFile({
        filePath: 'gs://bucket/dataset/data_2024_03.parquet',
        from: '2024-03-01',
        until: '2024-03-31',
        periodType: PeriodFormat.YEAR_MONTH,
      }),
      buildDataFile({
        filePath: 'gs://bucket/dataset/data_2022_12.parquet',
        from: new Date('2022-12-01T12:00:00Z'),
        until: new Date('2022-12-31T12:00:00Z'),
        periodType: PeriodFormat.YEAR_MONTH,
      }),
    ];

    const { result } = renderHook(() => useTimelineData(data));

    expect(result.current.isValid).toBe(true);
    expect(result.current.periodType).toBe(PeriodFormat.YEAR_MONTH);

    expect(result.current.items[0]?.filePath).toBe('gs://bucket/dataset/data_2022_12.parquet');
    expect(result.current.items[1]?.filePath).toBe('gs://bucket/dataset/data_2024_03.parquet');

    expect(result.current.years).toEqual([2022, 2023, 2024]);

    expect(result.current.slots[2022]).toHaveLength(12);
    expect(result.current.slots[2023]).toHaveLength(12);
    expect(result.current.slots[2024]).toHaveLength(12);
  });

  it('normalizes timezone-aware Date boundaries to UTC day keys', () => {
    const data = [
      buildDataFile({
        filePath: 'gs://bucket/dataset/data_2018_2019.parquet',
        from: new Date('2018-01-01T00:00:00Z'),
        until: new Date('2019-12-31T23:59:59Z'),
        periodType: PeriodFormat.YEAR,
      }),
      buildDataFile({
        filePath: 'gs://bucket/dataset/data_2021.parquet',
        from: new Date('2021-01-01T00:00:00Z'),
        until: new Date('2021-12-31T23:59:59Z'),
        periodType: PeriodFormat.YEAR,
      }),
    ];

    const { result } = renderHook(() => useTimelineData(data));

    expect(result.current.isValid).toBe(true);
    expect(result.current.items[0]?.end).toBe('2019-12-31');
    expect(result.current.years).toEqual([2018, 2019, 2020, 2021]);
  });

  it('keeps local calendar day for timezone-less Date values', () => {
    const data = [
      buildDataFile({
        filePath: 'gs://bucket/dataset/data_2018_2019.parquet',
        from: new Date(2018, 0, 1, 0, 0, 0),
        until: new Date(2019, 11, 31, 23, 59, 59),
        periodType: PeriodFormat.YEAR,
      }),
    ];

    const { result } = renderHook(() => useTimelineData(data));

    expect(result.current.isValid).toBe(true);
    expect(result.current.items[0]?.start).toBe('2018-01-01');
    expect(result.current.items[0]?.end).toBe('2019-12-31');
  });
});
