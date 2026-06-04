import { Card, Heading, Tooltip } from '@digdir/designsystemet-react';
import React, { useMemo } from 'react';
import { type DaplaDataFileDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language/src/localization';
import styles from './dataCoverageTimeline.module.css';
import { type Slot, type TimelineItem } from './types';
import { useTimelineData } from './useTimelineData';

const TOOLTIP_TEMPLATE = '{status}: {slotLabel} {year}';

const isTimelineDebugEnabled = (): boolean =>
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('timelineDebug') === '1';

const timelineDebug = (message: string, details?: unknown): void => {
  if (!isTimelineDebugEnabled()) return;
  /* biome-ignore lint/suspicious/noConsole: opt-in troubleshooting logs for deployed timeline debugging */
  console.info(`[timeline-debug] ${message}`, details);
};

/**
 * Replace `{key}` placeholders in `template` with the corresponding values.
 * Generic utility — not component-specific.
 *
 * @param template - String containing `{key}` placeholders.
 * @param values   - Map of placeholder keys to replacement values.
 * @returns The template with all placeholders replaced.
 */
export const formatTemplate = (template: string, values: Record<string, string | number>): string =>
  Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`{${key}}`, String(value)), template);

const toDayFromSlotDate = (date: Date): string => date.toISOString().slice(0, 10);

export const slotOverlapsItem = (slot: Slot, item: TimelineItem): boolean => {
  const slotStart = toDayFromSlotDate(slot.start);
  const slotEnd = toDayFromSlotDate(slot.end);
  const overlaps = item.start <= slotEnd && item.end >= slotStart;

  if (overlaps && (slotStart.startsWith('2020-') || slotEnd.startsWith('2020-'))) {
    timelineDebug('slot overlaps item', {
      slotStart,
      slotEnd,
      itemStart: item.start,
      itemEnd: item.end,
      filePath: item.filePath,
    });
  }

  return overlaps;
};

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
 * Shows a filled or empty visual state and attaches a Tooltip with the slot label and file path when present.
 *
 * @param slot        - Slot definition to render.
 * @param idx         - Zero-based index of the slot within the year.
 * @param totalSlots  - Total slots in the year, used to compute percentage width.
 * @param year        - The year this slot belongs to.
 * @param matchedItem - Matched `TimelineItem` when data exists for this slot.
 */
const TimelineCell: React.FC<CellProps> = ({ slot, idx, totalSlots, year, matchedItem }) => {
  const slotWidth = 100 / totalSlots;
  const text = localization.dataCoverageTimeline;
  const baseValues = { slotLabel: slot.label, year };

  const tooltipContent = formatTemplate(TOOLTIP_TEMPLATE, {
    ...baseValues,
    status: matchedItem ? text.tooltipStatusDataPresent : text.tooltipStatusMissingTargetSegment,
  });

  return (
    <Tooltip content={tooltipContent} placement='top'>
      <div
        aria-hidden='true'
        className={`${styles.cell} ${matchedItem ? styles.cellFilled : styles.cellEmpty}`}
        style={{ left: `${idx * slotWidth}%`, width: `${slotWidth}%` }}
      />
    </Tooltip>
  );
};

interface TimelineProps {
  data: DaplaDataFileDTO[];
}

/**
 * Renders the full data coverage timeline.
 *
 * One row is rendered per year, each divided into slots whose granularity
 * (month, quarter, week, etc.) is driven by the dataset's `period_type` field.
 * The axis row at the bottom mirrors the first year's slot labels so they
 * always stay in sync with the grid.
 *
 * Renders nothing when `isValid` is false (e.g. mixed `period_type` values).
 *
 * @param data - Array of file DTOs from the dataset API response.
 */
const DataCoverageTimeline: React.FC<TimelineProps> = ({ data }) => {
  const { isValid, items, years, slots } = useTimelineData(data);

  const findMatchingItemForSlot = useMemo(
    () => (slot: Slot) => items.find((item) => slotOverlapsItem(slot, item)),
    [items],
  );

  if (!isValid) return null;

  // Safe: `isValid` guarantees `years` is non-empty.
  const firstYear = years[0]!;

  return (
    <Card>
      <Heading level={2} className={styles.detailsHeading} data-size='md' id='tableHeading-dataCoverageTimeline'>
        {localization.datasetDetail.dataCoverageTimeline}
      </Heading>
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
                      matchedItem={findMatchingItemForSlot(slot)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
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
    </Card>
  );
};

export default DataCoverageTimeline;
