import React, { useMemo } from 'react';
import styles from './dataCoverageTimeline.module.css';

// ==========================================
// Types
// ==========================================

// Represents a single parsed data file entry from the backend.
// start/end are derived from contains_data_from and contains_data_until.
type TimelineItem = {
  filePath: string;
  periodType: string;
  start: Date;
  end: Date;
};

// Represents one visual cell in the timeline grid — a single period bucket
// (e.g. "Jan 2016" or "Q2 2017"). Generated from the period type, not from data.
type Slot = {
  start: Date;
  end: Date;
  label: string;
};

// ==========================================
// Period config table
//
// Defines how each period type splits a year into slots.
// Adding a new period type means adding one entry here — nothing else needs changing.
//
// count:      how many slots per year (e.g. 4 for quarterly)
// monthsEach: how many calendar months each slot spans
// label:      the display label for a slot, given its zero-based index
// ==========================================
type PeriodDef = {
  count: number;
  monthsEach: number;
  label: (slotIndex: number) => string;
};

const PERIOD_DEFS: Record<string, PeriodDef> = {
  YEAR_MONTH: { count: 12, monthsEach: 1,  label: (i) => new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2000, i, 1))) },
  BIMONTHLY:  { count: 6,  monthsEach: 2,  label: (i) => `B${i + 1}` },
  QUARTER:    { count: 4,  monthsEach: 3,  label: (i) => `Q${i + 1}` },
  TERTIAL:    { count: 3,  monthsEach: 4,  label: (i) => `T${i + 1}` },
  TRIANNUAL:  { count: 3,  monthsEach: 4,  label: (i) => `T${i + 1}` },
  SEMESTER:   { count: 2,  monthsEach: 6,  label: (i) => `H${i + 1}` },
  YEAR:       { count: 1,  monthsEach: 12, label: ()  => 'Full Year'  },
};

// Looks up a period def by exact name first, then by substring match.
// This handles variants like "YEAR_MONTH" matching "MONTH", or future
// suffixed types like "QUARTER_FISCAL".
const findPeriodDef = (periodType: string): PeriodDef | undefined => {
  const upper = periodType.toUpperCase();
  return PERIOD_DEFS[upper] ?? Object.entries(PERIOD_DEFS).find(([k]) => upper.includes(k))?.[1];
};

// ==========================================
// Slot generation
//
// Produces the full list of expected slots for a given year and period type.
// These slots define the grid — they exist regardless of whether data is present.
// Slots are always anchored to UTC midnight to avoid timezone issues.
// ==========================================
export const generateYearSlots = (year: number, periodType: string): Slot[] => {
  const upper = periodType.toUpperCase();

  // Weekly periods are handled separately since they don't divide cleanly
  // into months and don't fit the count/monthsEach model.
  if (upper.includes('WEEK')) {
    return Array.from({ length: 52 }, (_, i) => ({
      start: new Date(Date.UTC(year, 0, 1 + i * 7)),
      end:   new Date(Date.UTC(year, 0, 7 + i * 7, 23, 59, 59, 999)),
      label: `W${i + 1}`,
    }));
  }

  const def = findPeriodDef(periodType);
  if (!def) return [];

  return Array.from({ length: def.count }, (_, i) => ({
    start: new Date(Date.UTC(year, i * def.monthsEach, 1)),
    // Day 0 of the next month = last day of the current month
    end:   new Date(Date.UTC(year, (i + 1) * def.monthsEach, 0, 23, 59, 59, 999)),
    label: def.label(i),
  }));
};

// ==========================================
// Date parser
//
// Parses backend business date strings into UTC midnight Date objects.
// We strip the time component entirely because we only care about which
// year/month/day a period falls on, never the time within that day.
//
// The key problem this solves: JavaScript's Date constructor treats strings
// without a timezone suffix (e.g. "2016-01-01T00:00:00") as *local* time.
// In Norway (UTC+1) that shifts the date back to 2015-12-31T23:00Z, which
// would cause every item to appear one slot too early.
//
// If a pre-parsed Date object arrives (already shifted), we recover the
// correct date using local getters (getFullYear/getMonth/getDate), which
// still reflect the intended calendar date even though the UTC timestamp is wrong.
// ==========================================
const parseBusinessDate = (value: string | Date | undefined | null): Date => {
  if (!value) return new Date(NaN);

  if (value instanceof Date) {
    return new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
  }

  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return new Date(NaN);

  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
};

// ==========================================
// Data hook
//
// Takes the raw API response and returns everything the component needs to render:
// - items:      parsed and sorted list of data file entries
// - years:      the full range of years to display (including years with gaps)
// - slots:      pre-generated slot grids keyed by year
// - periodType: the shared period type across all items
//
// Returns isValid: false (and empty data) if:
// - the array is empty or unparseable
// - items have mixed period types (the grid would be ambiguous)
// ==========================================
export const useTimelineData = (data: any[]) => {
  // Parse raw items into typed TimelineItems, dropping any with invalid dates.
  // Sorted by start date so the first/last items give us the year range cheaply.
  const items = useMemo<TimelineItem[]>(() => {
    if (!Array.isArray(data)) return [];

    return data.flatMap((item) => {
      const start      = parseBusinessDate(item.containsDataFrom ?? item.contains_data_from);
      const end        = parseBusinessDate(item.containsDataUntil ?? item.contains_data_until);
      const periodType = item.periodType ?? item.period_type ?? '';

      if (isNaN(start.getTime()) || isNaN(end.getTime()) || !periodType) return [];

      return [{
        filePath: item.filePath ?? item.file_path ?? '',
        periodType,
        start,
        end,
      }];
    }).sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [data]);

  return useMemo(() => {
    const empty = {
      isValid:    false as const,
      periodType: '',
      items:      [] as TimelineItem[],
      years:      [] as number[],
      slots:      {} as Record<number, Slot[]>,
    };

    if (items.length === 0) return empty;

    // All items must share the same period type — mixing e.g. monthly and
    // quarterly data in one timeline would make the grid layout meaningless.
    const types = new Set(items.map((d) => d.periodType));
    if (types.size !== 1) return empty;

    // Reject overlapping periods — since items are sorted by start date, it's
    // enough to check that each item starts after the previous one ends.
    const hasOverlap = items.some((item, i) => i > 0 && item.start <= items[i - 1].end);
    if (hasOverlap) return empty;

    const periodType = items[0].periodType;

    // Since items are sorted, the first and last give us the year boundaries.
    // We include every year in between, even if some have no data at all,
    // so gaps in the middle of the range are visible.
    const minYear = items[0].start.getUTCFullYear();
    const maxYear = items[items.length - 1].start.getUTCFullYear();
    const years   = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

    // Pre-generate slots for every year so the component doesn't recompute
    // them on each render, and so the axis can read labels from slots[years[0]].
    const slots = Object.fromEntries(
      years.map((year) => [year, generateYearSlots(year, periodType)])
    );

    return { isValid: true as const, periodType, items, years, slots };
  }, [items]);
};

// ==========================================
// Slot-item matching
//
// Determines whether a given slot has a corresponding data file.
// We compare on UTC year+month rather than exact timestamps, which makes
// matching robust against any residual sub-day timezone differences.
// For all period types, the item's start month always equals the slot's start month.
// ==========================================
const toYearMonth = (d: Date) => `${d.getUTCFullYear()}-${d.getUTCMonth()}`;

const findItemForSlot = (slot: Slot, items: TimelineItem[]): TimelineItem | undefined =>
  items.find((item) => toYearMonth(item.start) === toYearMonth(slot.start));

// ==========================================
// Cell
//
// Renders a single slot in the timeline track.
// Shows a filled or empty state, and a tooltip with details on hover.
// Tooltip position (left/center/right) is chosen based on the slot's
// horizontal position to keep it within the component bounds.
// ==========================================
interface CellProps {
  slot:        Slot;
  idx:         number;
  totalSlots:  number;
  year:        number;
  matchedItem: TimelineItem | undefined;
}

const TimelineCell: React.FC<CellProps> = ({ slot, idx, totalSlots, year, matchedItem }) => {
  const slotWidth = 100 / totalSlots;
  const centerPct = (idx + 0.5) * slotWidth;

  const side =
    totalSlots === 1 ? 'Center'
    : centerPct < 15 ? 'Left'
    : centerPct > 85 ? 'Right'
    : 'Center';

  return (
    <div
      className={`${styles.cell} ${matchedItem ? styles.cellFilled : styles.cellEmpty}`}
      style={{ left: `${idx * slotWidth}%`, width: `${slotWidth}%` }}
    >
      <div className={`${styles.tooltip} ${styles[`tooltip${side}`]}`}>
        <div className={styles.tooltipContent}>
          {matchedItem ? (
            <>
              <div className={styles.tooltipHeaderFilled}>📁 File Data Present</div>
              <div><span className={styles.tooltipLabel}>PATH:</span>{matchedItem.filePath}</div>
              <div><span className={styles.tooltipLabel}>SLOT:</span>{slot.label} {year}</div>
            </>
          ) : (
            <>
              <div className={styles.tooltipHeaderEmpty}>🚫 Missing Target Segment</div>
              <div><span className={styles.tooltipLabel}>PERIOD:</span>{slot.label} {year}</div>
            </>
          )}
        </div>
        <div className={`${styles.arrow} ${styles[`arrow${side}`]}`} />
      </div>
    </div>
  );
};

// ==========================================
// Main component
//
// Renders the full timeline: one row per year, each row divided into slots.
// The axis row at the bottom shows slot labels (Jan-Dec, Q1-Q4, etc.)
// and is derived from the first year's slots so labels always stay in sync.
// ==========================================
interface TimelineProps {
  data: any[];
}

const DataCoverageTimeline: React.FC<TimelineProps> = ({ data }) => {
  const { isValid, periodType, items, years, slots } = useTimelineData(data);

  // Render nothing if the data is empty, unparseable, or has mixed period types.
  if (!isValid) return null;

  return (
    <div className={styles.container}>
      <div className={styles.timelineBody}>
        {years.map((year) => (
          <div key={year} className={styles.rowWrapper}>
            <span className={styles.yearLabel}>{year}</span>
            <div className={styles.track}>
              {slots[year].map((slot, idx) => (
                <TimelineCell
                  key={slot.label}
                  slot={slot}
                  idx={idx}
                  totalSlots={slots[year].length}
                  year={year}
                  matchedItem={findItemForSlot(slot, items)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Axis labels — derived from the first year's slots so they always
            match the grid regardless of period type */}
        <div className={styles.axisRow}>
          <div className={styles.axisSpacer} />
          <div className={styles.axisLabelsContainer}>
            {slots[years[0]].map((slot) => (
              <span key={slot.label} className={styles.axisLabel}>{slot.label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCoverageTimeline;