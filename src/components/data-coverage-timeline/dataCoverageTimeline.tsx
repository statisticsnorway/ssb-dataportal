import { Tooltip } from '@digdir/designsystemet-react';
import React from 'react';
import { type DaplaDataFileDTO } from '@/libs/data-access/datadoc';
import styles from './dataCoverageTimeline.module.css';
import { type Slot, type TimelineItem } from './types';
import { useTimelineData } from './useTimelineData';

/**
 * Convert a Date into a UTC year-month key string used for slot matching.
 *
 * We compare on UTC year+month rather than exact timestamps to make matching
 * robust against sub-day timezone differences. The returned string is
 * `${year}-${monthIndex}` where `monthIndex` is the zero-based UTC month (0-11).
 *
 * @param d - Date to convert.
 * @returns A string key representing the UTC year and month.
 */
const toYearMonth = (d: Date) => `${d.getUTCFullYear()}-${d.getUTCMonth()}`;

/**
 * Find the timeline item that corresponds to a given slot by comparing
 * UTC year+month keys. Returns `undefined` when no matching item exists.
 *
 * @param slot - Slot to match.
 * @param items - Parsed timeline items to search.
 * @returns The matched `TimelineItem` or `undefined`.
 */
const findItemForSlot = (slot: Slot, items: TimelineItem[]): TimelineItem | undefined =>
  items.find((item) => toYearMonth(item.start) === toYearMonth(slot.start));

/**
 * Props for `TimelineCell`.
 */
interface CellProps {
  slot: Slot;
  idx: number;
  totalSlots: number;
  year: number;
  matchedItem: TimelineItem | undefined;
}

/**
 * Renders a single slot cell within a year's timeline row.
 *
 * Shows a filled or empty visual state and attaches a tooltip (via
 * @digdir/designsystemet-react) displaying the slot label and matched
 * file path when present. Tooltip positioning is delegated to Floating UI.
 *
 * @param slot - Slot definition to render.
 * @param idx - Index of the slot within the year.
 * @param totalSlots - Total number of slots in the year (used to compute width).
 * @param year - Year the slot belongs to.
 * @param matchedItem - Optional matched `TimelineItem` for filled state and tooltip.
 */
const TimelineCell: React.FC<CellProps> = ({ slot, idx, totalSlots, year, matchedItem }) => {
  const slotWidth = 100 / totalSlots;

  const tooltipContent = matchedItem
    ? `File Data Present — ${slot.label} ${year}\n${matchedItem.filePath}`
    : `Missing Target Segment — ${slot.label} ${year}`;

  return (
    <Tooltip content={tooltipContent} placement='top'>
      <div
        className={`${styles.cell} ${matchedItem ? styles.cellFilled : styles.cellEmpty}`}
        style={{ left: `${idx * slotWidth}%`, width: `${slotWidth}%` }}
      />
    </Tooltip>
  );
};

/**
 * Main component that renders the full timeline.
 *
 * Renders one row per year, each row divided into slots.
 * The axis row at the bottom shows slot labels (Jan-Dec, Q1-Q4, etc.)
 * and is derived from the first year's slots so labels always stay in sync.
 *
 * @param data - Array of file DTOs from the dataset API response.
 */
interface TimelineProps {
  data: DaplaDataFileDTO[];
}

const DataCoverageTimeline: React.FC<TimelineProps> = ({ data }) => {
  const { isValid, items, years, slots } = useTimelineData(data);

  if (!isValid) return null;

  const firstYear = years[0]!;

  return (
    <div className={styles.container}>
      <div className={styles.timelineBody}>
        {years.map((year) => {
          const yearSlots = slots[year] ?? [];
          return (
            <div key={year} className={styles.rowWrapper}>
              <span className={styles.yearLabel}>{year}</span>
              <div className={styles.track}>
                {yearSlots.map((slot, idx) => (
                  <TimelineCell
                    key={slot.label}
                    slot={slot}
                    idx={idx}
                    totalSlots={yearSlots.length}
                    year={year}
                    matchedItem={findItemForSlot(slot, items)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Axis labels — derived from the first year's slots so they always
            match the grid regardless of period type */}
        <div className={styles.axisRow}>
          <div className={styles.axisSpacer} />
          <div className={styles.axisLabelsContainer}>
            {(slots[firstYear] ?? []).map((slot) => (
              <span key={slot.label} className={styles.axisLabel}>
                {slot.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCoverageTimeline;
