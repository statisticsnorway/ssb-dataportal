import { useMemo } from 'react';
import { type DaplaDataFileDTO, PeriodFormat } from '@/libs/data-access/datadoc';
import { clientLogger } from '@/libs/logger/client-logger';
import { generateYearSlots } from './periodDefs';
import { type Slot, type TimelineItem } from './types';

const empty = {
  isValid: false as const,
  periodType: '',
  items: [] as TimelineItem[],
  years: [] as number[],
  slots: {} as Record<number, Slot[]>,
};

/**
 * Parses a backend date string or pre-parsed Date into a UTC midnight Date object.
 *
 * We strip the time component entirely because we only care about which year/month/day
 * a period falls on, never the time within that day.
 *
 * If a pre-parsed `Date` object arrives (already shifted), we recover the correct calendar
 * date using local getters (`getFullYear`/`getMonth`/`getDate`), which still reflect the
 * intended date even though the UTC timestamp is wrong.
 *
 * @param value - A date string in `YYYY-MM-DD` (or `YYYY-MM-DDTHH:mm:ss`) format, a `Date`
 *   object, or a nullish value.
 * @returns A UTC midnight `Date` for the given calendar date, or `new Date(NaN)` if the
 *   input is missing or unparseable.
 */
const parseDate = (value: string | Date | undefined | null): Date => {
  if (!value) return new Date(Number.NaN);

  const [y, m, d] =
    value instanceof Date
      ? [value.getFullYear(), value.getMonth() + 1, value.getDate()]
      : (value.match(/^(\d{4})-(\d{2})-(\d{2})/)?.slice(1) ?? []);

  return y ? new Date(Date.UTC(+y, +m - 1, +d)) : new Date(Number.NaN);
};

/**
 * Converts raw API DTOs into typed `TimelineItem` objects, dropping any entries
 * that have invalid/missing dates or a missing `period_type`.
 * The result is sorted ascending by start date so that the first and last elements
 * give the year boundaries cheaply, and the overlap check can run in a single pass.
 *
 * @param data - Raw array of file DTOs from the API response.
 * @returns Parsed and sorted timeline items, potentially empty if all entries were invalid.
 */
const parseItems = (data: DaplaDataFileDTO[]): TimelineItem[] =>
  data
    .flatMap(({ file_path, contains_data_from, contains_data_until, period_type }) => {
      const start = parseDate(contains_data_from);
      const end = parseDate(contains_data_until);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || !period_type) return [];
      return [{ filePath: file_path, periodType: period_type, start, end }];
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime());

/**
 * Returns `true` if the items span more than one distinct `periodType`.
 *
 * Mixed period types (e.g. some files are `YEAR_MONTH` and others are `YEAR_WEEK`)
 * make the slot grid ambiguous, so we treat this as an invalid dataset.
 *
 * @param items - Parsed timeline items.
 */
const hasMixedPeriodTypes = (items: TimelineItem[]): boolean => new Set(items.map((d) => d.periodType)).size !== 1;

/**
 * Returns `true` if any item's start date is on or before the previous item's end date.
 *
 * @param items - Parsed and sorted timeline items.
 */
const hasOverlappingPeriods = (items: TimelineItem[]): boolean =>
  items.some((item, i) => i > 0 && item.start <= items[i - 1]!.end);

const hasSupportedPeriodType = (periodType: PeriodFormat): boolean => generateYearSlots(2000, periodType).length > 0;

/**
 * Derives the full year range covered by the items and pre-generates a slot grid for
 * each year in that range.
 *
 * Every year between `minYear` and `maxYear` is included even if it contains no data,
 * so that gaps in the middle of the timeline are visually represented rather than silently
 * collapsed.
 *
 * Slots are pre-generated here (rather than inside the render) so the component doesn't
 * recompute them on each render cycle, and so the axis can read labels from `slots[years[0]]`
 * without re-deriving them.
 *
 * @param items - Parsed, sorted, and validated timeline items.
 * @param periodType - The shared period type for all items.
 * @returns An object with `years` (the full inclusive range) and `slots` (a map from year
 *   to its pre-generated slot array).
 */
const buildYearSlots = (
  items: TimelineItem[],
  periodType: PeriodFormat,
): { years: number[]; slots: Record<number, Slot[]> } => {
  const minYear = items[0]!.start.getUTCFullYear();
  const maxYear = items[items.length - 1]!.start.getUTCFullYear();
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  const slots = Object.fromEntries(years.map((year) => [year, generateYearSlots(year, periodType)]));
  return { years, slots };
};

/**
 * Transforms a raw array of API file DTOs into everything the timeline component needs
 * to render: parsed items, a year range, pre-generated slot grids, and the shared period type.
 *
 * Returns `isValid: false` (with empty collections) when:
 * - `data` is empty or all entries fail to parse
 * - items have mixed `period_type` values (the slot grid would be ambiguous)
 * - any two items have overlapping date ranges
 * - `period_type` has no supported slot definition
 *
 * All derived values are memoised on `data` reference equality so the component only
 * recomputes when the API response actually changes.
 *
 * @param data - Raw file DTOs from the dataset API response.
 * @returns `{ isValid, periodType, items, years, slots }`
 */
export const useTimelineData = (
  data: DaplaDataFileDTO[],
): {
  isValid: boolean;
  periodType: PeriodFormat | string;
  items: TimelineItem[];
  years: number[];
  slots: Record<number, Slot[]>;
} => {
  return useMemo(() => {
    if (data.length === 0) {
      clientLogger.warn('Timeline hidden reason: no data');
      return empty;
    }

    const items = parseItems(data);
    if (items.length === 0) {
      clientLogger.warn('Timeline hidden reason: no valid timeline items');
      return empty;
    }
    if (hasMixedPeriodTypes(items)) {
      clientLogger.warn('Timeline hidden reason: mixed period types');
      return empty;
    }
    if (hasOverlappingPeriods(items)) {
      clientLogger.warn('Timeline hidden reason: overlapping periods');
      return empty;
    }

    const periodType = items[0]!.periodType;
    if (!hasSupportedPeriodType(periodType)) {
      clientLogger.warn(`Timeline hidden reason: unsupported period type (${periodType})`);
      return empty;
    }
    const { years, slots } = buildYearSlots(items, periodType);

    return { isValid: true as const, periodType, items, years, slots };
  }, [data]);
};
