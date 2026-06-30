import { Card, Heading, Popover } from '@digdir/designsystemet-react';
import React, { useMemo } from 'react';
import { DataFileSearchHit } from '@/app/(details)/data-products/[shortName]/components/DataFileSearchHit';
import { localization } from '@/libs/language/src/localization';
import styles from './dataCoverageTimeline.module.css';
import { type Slot, type TimelineItem } from './types';
import { TimelineData } from './useTimelineData';

const TOOLTIP_TEMPLATE = '{status}: {slotLabel} {year}';
const DATA_PRESENT_TEMPLATE = '{slotLabel} {year}';

/**
 * Replace `{key}` placeholders in `template` with the corresponding values.
 * Generic utility — not component-specific.
 *
 * @param template - String containing `{key}` placeholders.
 * @param values   - Map of placeholder keys to replacement values.
 * @returns The template with all placeholders replaced.
 */
const formatTemplate = (template: string, values: Record<string, string | number>): string =>
  Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`{${key}}`, String(value)), template);

export const slotOverlapsItem = (slot: Slot, item: TimelineItem): boolean =>
  item.start <= slot.end && item.end >= slot.start;

const getFileNameFromPath = (filePath: string): string => {
  const normalized = filePath.endsWith('/') ? filePath.slice(0, -1) : filePath;
  const lastSlash = normalized.lastIndexOf('/');
  return lastSlash >= 0 ? normalized.slice(lastSlash + 1) : normalized;
};

export const formatAvailableDatasets = (filePaths: string[]): string[] =>
  Array.from(new Set(filePaths.map(getFileNameFromPath).filter(Boolean)));

interface CellProps {
  slot: Slot;
  idx: number;
  totalSlots: number;
  year: number;
  matchedItems: TimelineItem[];
}

/**
 * Renders a single slot cell within a year's timeline row.
 *
 * Shows a filled or empty visual state and attaches a Popover with details when present.
 *
 * @param slot        - Slot definition to render.
 * @param idx         - Zero-based index of the slot within the year.
 * @param totalSlots  - Total slots in the year, used to compute percentage width.
 * @param year        - The year this slot belongs to.
 * @param matchedItems - Matched `TimelineItem` values when data exists for this slot.
 */
const TimelineCell: React.FC<CellProps> = ({ slot, idx, totalSlots, year, matchedItems }) => {
  const slotWidth = 100 / totalSlots;
  const text = localization.dataCoverageTimeline;
  const baseValues = { slotLabel: slot.label, year };
  const hasData = matchedItems.length > 0;
  const isFirst = idx === 0;
  const isLast = idx === totalSlots - 1;
  const datasetNames = formatAvailableDatasets(matchedItems.map((item: TimelineItem) => item.file_path));
  const dataPresentTitle = formatTemplate(DATA_PRESENT_TEMPLATE, baseValues);

  const baseTooltip = formatTemplate(TOOLTIP_TEMPLATE, {
    ...baseValues,
    status: text.tooltipStatusMissingTargetSegment,
  });

  const triggerLabel =
    hasData && datasetNames.length > 0
      ? `${dataPresentTitle}. ${text.availableDataFileLabel}: ${datasetNames.join(', ')}`
      : baseTooltip;

  return (
    <Popover.TriggerContext>
      <div
        aria-hidden='true'
        className={`${styles.cell} ${hasData ? styles.cellFilled : styles.cellEmpty} ${isFirst ? styles.cellFirst : ''} ${isLast ? styles.cellLast : ''}`}
        style={{ left: `${idx * slotWidth}%`, width: `${slotWidth}%` }}
      />
      <Popover.Trigger
        aria-label={triggerLabel}
        className={styles.cellTrigger}
        style={{ left: `${idx * slotWidth}%`, width: `${slotWidth}%` }}
      />
      <Popover
        placement='top'
        data-autoplacement='true'
        id={`timeline-cell-${year}-${idx}`}
        className={`${styles.timelinePopover} ${hasData ? styles.timelinePopoverFilled : styles.timelinePopoverEmpty}`}
      >
        {hasData && datasetNames.length > 0 ? (
          <div className={styles.popoverContent}>
            <div className={styles.popoverTitle}>{dataPresentTitle}</div>
            <div>
              {`${datasetNames.length} ${datasetNames.length === 1 ? text.availableDataFileLabel : text.availableDataFileLabelPlural}`}
              :
            </div>
            <div className={styles.popoverList}>
              {matchedItems.map((dataFile: TimelineItem) => (
                <DataFileSearchHit dataFile={dataFile} key={dataFile.file_path} />
              ))}
            </div>
          </div>
        ) : (
          baseTooltip
        )}
      </Popover>
    </Popover.TriggerContext>
  );
};

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
const DataCoverageTimeline = ({ isValid, allItems, years, slots }: TimelineData) => {
  const findMatchingItemsForSlot = useMemo(
    () => (slot: Slot) => allItems.filter((item) => slotOverlapsItem(slot, item)),
    [allItems],
  );

  if (!isValid) return null;

  const displayYears = [...years].reverse();

  // Safe: `isValid` guarantees `years` is non-empty.
  const firstYear = displayYears[0]!;

  return (
    <Card>
      <Heading level={2} className={styles.detailsHeading} data-size='md' id='tableHeading-dataCoverageTimeline'>
        {localization.datasetDetail.dataCoverageTimeline}
      </Heading>
      <div className={styles.container}>
        <div className={styles.timelineBody}>
          {displayYears.map((year) => {
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
                      matchedItems={findMatchingItemsForSlot(slot)}
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
