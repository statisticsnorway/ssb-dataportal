import { useMemo } from 'react';
import { type DaplaDataFileDTO, PeriodFormat } from '@/libs/data-access/datadoc';
import { clientLogger } from '@/libs/logger/client-logger';
import { generateYearSlots } from './periodDefinitions';
import { type Slot, type TimelineItem } from './types';
import { pad2 } from './utils';

const empty = {
  isValid: false as const,
  periodType: '' as PeriodFormat | '',
  items: [] as TimelineItem[],
  years: [] as number[],
  slots: {} as Record<number, Slot[]>,
};

/**
 * Parses a backend date value into a date-only string (`YYYY-MM-DD`).
 *
 * We strip the time component entirely because we only care about day-level
 * semantics in the timeline, never the time within that day.
 *
 * The API currently sends timezone-less datetimes, so Date objects represent
 * floating calendar days rather than absolute UTC instants. We therefore read
 * the local calendar day, not the UTC day.
 *
 * @param value - A `Date` object, or null or undefined.
 * @returns A date-only key string (`YYYY-MM-DD`), or `null` if the input is missing or invalid.
 */
const parseDay = (value: Date | undefined | null): string | null => {
  if (!value) return null;
  if (Number.isNaN(value.getTime())) return null;

  // Dates parsed from timezone-less strings (e.g. "2024-03-15T00:00:00") are
  // treated as local midnight. In positive-offset zones, UTC conversion shifts
  // them to the previous day — return the local calendar date instead.
  if (value.getHours() === 0 && value.getMinutes() === 0 && value.getSeconds() === 0 && value.getMilliseconds() === 0) {
    return `${value.getFullYear()}-${pad2(value.getMonth() + 1)}-${pad2(value.getDate())}`;
  }

  return value.toISOString().slice(0, 10);
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
      const start = parseDay(contains_data_from);
      const end = parseDay(contains_data_until);
      if (!start || !end || !period_type) return [];
      return [{ filePath: file_path, periodType: period_type, start, end }];
    })
    .sort((a, b) => a.start.localeCompare(b.start));

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
 * Returns `true` if any item's start date is strictly before the previous item's end date.
 *
 * @param items - Parsed and sorted timeline items.
 */
const hasOverlappingPeriods = (items: TimelineItem[]): boolean =>
  items.some((item, i) => i > 0 && item.start < items[i - 1]!.end);

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
  const minYear = Number(items.at(0)!.start.slice(0, 4));
  const maxYear = Number(items.at(-1)!.end.slice(0, 4));
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
  periodType: PeriodFormat | '';
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
