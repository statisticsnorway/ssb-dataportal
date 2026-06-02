import { PeriodFormat } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language/src/localization';
import { type PeriodDef, type Slot } from './types';

/**
 * Period config table.
 *
 * Defines how each period type splits a year into slots. Adding a new period
 * type means adding one entry here — nothing else needs changing.
 *
 * Properties:
 * - `count`: how many slots per year (e.g. 4 for quarterly)
 * - `label`: the display label for a slot, given its zero-based index
 *
 * `monthsEach` (slots per year ÷ 12 months) is derived on-the-fly in `generateYearSlots`.
 */
export const PERIOD_DEFS: Partial<Record<PeriodFormat, Omit<PeriodDef, 'monthsEach'>>> = {
  [PeriodFormat.YEAR_MONTH]: {
    count: 12,
    label: (i) => localization.dataCoverageTimeline.monthsShort[i] ?? '',
  },
  [PeriodFormat.YEAR_MONTH_DAY]: {
    count: 12,
    label: (i) => localization.dataCoverageTimeline.monthsShort[i] ?? '',
  },
  [PeriodFormat.BIMESTER]: {
    count: 6,
    label: (i) => `${localization.dataCoverageTimeline.labelBimesterPrefix}${i + 1}`,
  },
  [PeriodFormat.QUARTER]: {
    count: 4,
    label: (i) => `${localization.dataCoverageTimeline.labelQuarterPrefix}${i + 1}`,
  },
  [PeriodFormat.TRIANNUAL]: {
    count: 3,
    label: (i) => `${localization.dataCoverageTimeline.labelTriannualPrefix}${i + 1}`,
  },
  [PeriodFormat.HALF_YEAR]: {
    count: 2,
    label: (i) => `${localization.dataCoverageTimeline.labelHalfYearPrefix}${i + 1}`,
  },
  [PeriodFormat.YEAR]: {
    count: 1,
    label: () => localization.dataCoverageTimeline.labelFullYear,
  },
};

/**
 * Looks up a period def by exact `PeriodFormat` key.
 *
 * @param periodType - Period format key to look up.
 * @returns The matching period config or `undefined`.
 */
export const findPeriodDef = (periodType: PeriodFormat): (typeof PERIOD_DEFS)[PeriodFormat] | undefined =>
  PERIOD_DEFS[periodType];

/**
 * Produces the full list of expected slots for a given year and period type.
 *
 * These slots define the grid — they exist regardless of whether data is present.
 * Slots are anchored to UTC midnight to avoid timezone issues; the `end` is set
 * to the last millisecond of the slot's final day.
 *
 * @param year - The UTC year for which to generate slots.
 * @param periodType - The period type that defines slot size/count.
 * @returns An array of `Slot` objects for the full year.
 */
export const generateYearSlots = (year: number, periodType: PeriodFormat): Slot[] => {
  const def = findPeriodDef(periodType);
  if (!def) return [];

  const monthsEach = 12 / def.count;

  return Array.from({ length: def.count }, (_, i) => ({
    start: new Date(Date.UTC(year, i * monthsEach, 1)),
    // Day 0 of the next month = last day of the current month
    end: new Date(Date.UTC(year, (i + 1) * monthsEach, 0, 23, 59, 59, 999)),
    label: def.label(i),
  }));
};
