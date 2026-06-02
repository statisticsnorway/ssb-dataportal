import { Card, Heading, Tooltip } from '@digdir/designsystemet-react';
import React, { useMemo } from 'react';
import { type DaplaDataFileDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language/src/localization';
import styles from './dataCoverageTimeline.module.css';
import { type Slot, type TimelineItem } from './types';
import { useTimelineData } from './useTimelineData';

const TOOLTIP_TEMPLATE = '{status}: {slotLabel} {year}';
const ARIA_TEMPLATE_BASE = '{status}: {slotLabel} {year}.';
const ARIA_TEMPLATE_WITH_FILE = '{status}: {slotLabel} {year}. {filePathLabel}: {filePath}';

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

/**
 * Convert a Date to a UTC year-month key string used for slot matching.
 *
 * Comparing on UTC year+month (rather than exact timestamps) makes matching
 * robust against sub-day timezone differences.
 *
 * @param d - Date to convert.
 * @returns A `"${year}-${monthIndex}"` string where `monthIndex` is 0-based.
 */
const toYearMonth = (d: Date): string => `${d.getUTCFullYear()}-${d.getUTCMonth()}`;

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

  const ariaLabel = matchedItem
    ? formatTemplate(ARIA_TEMPLATE_WITH_FILE, {
        ...baseValues,
        status: text.statusDataPresent,
        filePathLabel: text.filePathLabel,
        filePath: matchedItem.filePath,
      })
    : formatTemplate(ARIA_TEMPLATE_BASE, {
        ...baseValues,
        status: text.statusMissingTargetSegment,
      });

  const tooltipContent = formatTemplate(TOOLTIP_TEMPLATE, {
    ...baseValues,
    status: matchedItem ? text.tooltipStatusDataPresent : text.tooltipStatusMissingTargetSegment,
  });

  return (
    <Tooltip content={tooltipContent} placement='top'>
      <div
        tabIndex={0}
        role='group'
        aria-label={ariaLabel}
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

  const itemsByYearMonth = useMemo(() => new Map(items.map((item) => [toYearMonth(item.start), item])), [items]);

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
                      matchedItem={itemsByYearMonth.get(toYearMonth(slot.start))}
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
