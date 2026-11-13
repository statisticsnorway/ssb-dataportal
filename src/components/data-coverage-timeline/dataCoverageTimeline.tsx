import { Button, Heading, Popover } from '@digdir/designsystemet-react';
import React, { useId, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { DataFileSearchHit } from '@/app/(details)/data-products/[shortName]/components/DataFileSearchHit';
import { localization } from '@/libs/language/src/localization';
import styles from './dataCoverageTimeline.module.css';
import { type Slot, type TimelineItem } from './types';
import { type TimelineData } from './useTimelineData';

const TOOLTIP_TEMPLATE = '{status}: {slotLabel} {year}';
const DATA_PRESENT_TEMPLATE = '{slotLabel} {year}';
const MAX_COLLAPSED_YEAR_ROWS = 5;
const subscribeToMobile = (callback: () => void) => {
  const query = window.matchMedia('(max-width: 600px)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
};
const getMobileSnapshot = () => window.matchMedia('(max-width: 600px)').matches;
const getServerSnapshot = () => false;

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

interface CellProps {
  slot: Slot;
  idx: number;
  totalSlots: number;
  year: number;
  matchedItems: TimelineItem[];
  hasFilteredData: boolean;
  isOutsideSelectedRange: boolean;
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
const TimelineCell: React.FC<CellProps> = ({
  slot,
  idx,
  totalSlots,
  year,
  matchedItems,
  hasFilteredData,
  isOutsideSelectedRange,
}) => {
  const popoverId = useId();
  const text = localization.dataCoverageTimeline;
  const baseValues = { slotLabel: slot.label, year };
  const hasData = matchedItems.length > 0;
  const isFirst = idx === 0;
  const isLast = idx === totalSlots - 1;
  const dataPresentTitle = formatTemplate(DATA_PRESENT_TEMPLATE, baseValues);

  const baseTooltip = formatTemplate(TOOLTIP_TEMPLATE, {
    ...baseValues,
    status: text.tooltipStatusMissingTargetSegment,
  });

  const fileCountLabel = `${matchedItems.length} ${matchedItems.length === 1 ? text.availableDataFileLabel : text.availableDataFileLabelPlural}`;
  const triggerLabel = hasData
    ? `${text.tooltipStatusDataPresent}: ${dataPresentTitle}. ${fileCountLabel}`
    : hasFilteredData
      ? formatTemplate(text.dataAvailableButFiltered, baseValues)
      : isOutsideSelectedRange
        ? formatTemplate(text.outsideSelectedPeriodRange, baseValues)
        : baseTooltip;

  return (
    <Popover.TriggerContext>
      <div className={styles.cellSegment}>
        <div
          aria-hidden='true'
          className={`${styles.cell} ${hasData ? styles.cellFilled : styles.cellEmpty} ${hasFilteredData ? styles.cellFiltered : ''} ${isFirst ? styles.cellFirst : ''} ${isLast ? styles.cellLast : ''}`}
        />
        <Popover.Trigger aria-label={triggerLabel} className={styles.cellTrigger} />
      </div>
      <Popover
        placement='top'
        data-autoplacement='true'
        id={popoverId}
        className={`${styles.timelinePopover} ${hasData ? styles.timelinePopoverFilled : styles.timelinePopoverEmpty}`}
      >
        {hasData ? (
          <div className={styles.popoverContent}>
            <div className={styles.popoverTitle}>{dataPresentTitle}</div>
            <div>{fileCountLabel}:</div>
            <div className={styles.popoverList}>
              {matchedItems.map((dataFile: TimelineItem) => (
                <DataFileSearchHit dataFile={dataFile} key={dataFile.file_path} />
              ))}
            </div>
          </div>
        ) : hasFilteredData ? (
          formatTemplate(text.dataAvailableButFiltered, baseValues)
        ) : isOutsideSelectedRange ? (
          formatTemplate(text.outsideSelectedPeriodRange, baseValues)
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
const DataCoverageTimeline = ({
  isValid,
  allItems,
  unfilteredItems = allItems,
  years,
  slots,
  selectedPeriodRange,
}: TimelineData & {
  unfilteredItems?: TimelineItem[];
  selectedPeriodRange?: { start: string; end: string };
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const isMobile = useSyncExternalStore(subscribeToMobile, getMobileSnapshot, getServerSnapshot);
  const instanceId = useId();
  const headingId = `${instanceId}-heading`;
  const rowsId = `${instanceId}-years`;
  const toggleRef = useRef<HTMLButtonElement>(null);
  const periodsByYear = useMemo(
    () =>
      new Map(
        years.map((year) => [
          year,
          (slots[year] ?? []).map((slot) => {
            const isOutsideSelectedRange =
              selectedPeriodRange !== undefined &&
              !(slot.start >= selectedPeriodRange.start && slot.end <= selectedPeriodRange.end);
            const matchedItems = isOutsideSelectedRange ? [] : allItems.filter((item) => slotOverlapsItem(slot, item));
            const hasFilteredData =
              matchedItems.length === 0 && unfilteredItems.some((item) => slotOverlapsItem(slot, item));
            return { slot, matchedItems, hasFilteredData, isOutsideSelectedRange };
          }),
        ]),
      ),
    [allItems, unfilteredItems, selectedPeriodRange, slots, years],
  );
  const hasAnyFilteredData = [...periodsByYear.values()].some((periods) =>
    periods.some((period) => period.hasFilteredData),
  );

  if (!isValid) return null;

  const displayYears = [...years].reverse();
  const canCollapseYears = displayYears.length > MAX_COLLAPSED_YEAR_ROWS;
  const visibleYears =
    canCollapseYears && !isExpanded ? [...displayYears.slice(0, 3), null, ...displayYears.slice(-2)] : displayYears;

  // Safe: `isValid` guarantees `years` is non-empty.
  const firstYear = displayYears[0]!;
  const axisSlots = slots[firstYear] ?? [];
  const useMonthInitials = axisSlots.length === 12;

  return (
    <>
      <Heading level={2} className={styles.detailsHeading} data-size='md' id={headingId}>
        {localization.datasetDetail.dataCoverageTimeline}
      </Heading>
      <section className={styles.container} aria-labelledby={headingId} data-testid='data-coverage-timeline'>
        {canCollapseYears && (
          <Button
            type='button'
            className={styles.timelineToggle}
            ref={toggleRef}
            variant='secondary'
            aria-controls={rowsId}
            aria-expanded={isExpanded}
            onClick={() => {
              setIsExpanded((expanded) => !expanded);
              setExpandedYear(null);
            }}
          >
            {isExpanded
              ? localization.datasetDetail.showFewerTimelinePeriods
              : localization.datasetDetail.showAllTimelinePeriods}
          </Button>
        )}
        <div className={styles.timelineBody}>
          <div className={styles.yearRows} id={rowsId}>
            {visibleYears.map((year) => {
              if (year === null) {
                return (
                  <div key='ellipsis' className={styles.ellipsisRow}>
                    <span className={styles.ellipsisSpacer} aria-hidden='true' />
                    <div className={styles.ellipsisTrack}>
                      <Button
                        type='button'
                        className={styles.ellipsisButton}
                        variant='tertiary'
                        aria-label={localization.datasetDetail.showAllTimelinePeriods}
                        aria-controls={rowsId}
                        aria-expanded='false'
                        onClick={() => {
                          setIsExpanded(true);
                          toggleRef.current?.focus();
                        }}
                      >
                        <svg aria-hidden='true' viewBox='0 0 24 24' fill='currentColor'>
                          <circle cx='12' cy='6' r='1.5' />
                          <circle cx='12' cy='12' r='1.5' />
                          <circle cx='12' cy='18' r='1.5' />
                        </svg>
                      </Button>
                    </div>
                  </div>
                );
              }

              const periods = periodsByYear.get(year) ?? [];
              if (isMobile) {
                const panelId = `${instanceId}-${year}`;
                const open = expandedYear === year;
                const availablePeriods = periods.filter(
                  ({ matchedItems, hasFilteredData }) => matchedItems.length > 0 || hasFilteredData,
                );
                return (
                  <div key={year}>
                    <Button
                      variant='tertiary'
                      className={styles.mobileYearButton}
                      aria-label={formatTemplate(
                        open ? localization.dataCoverageTimeline.hideYear : localization.dataCoverageTimeline.showYear,
                        { year },
                      )}
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setExpandedYear(open ? null : year)}
                    >
                      <span className={styles.yearLabel}>{year}</span>
                      <span className={styles.mobileTrack} aria-hidden='true'>
                        {periods.map(({ slot, matchedItems, hasFilteredData }) => (
                          <span
                            key={slot.label}
                            className={`${styles.mobileSegment} ${
                              matchedItems.length
                                ? styles.cellFilled
                                : hasFilteredData
                                  ? `${styles.cellEmpty} ${styles.cellFiltered}`
                                  : styles.cellEmpty
                            }`}
                          />
                        ))}
                      </span>
                    </Button>
                    <div id={panelId} hidden={!open} className={styles.mobileFiles}>
                      {open &&
                        (availablePeriods.length ? (
                          availablePeriods.map(({ slot, matchedItems }) => (
                            <div key={slot.label}>
                              <Heading level={3} data-size='xs'>{`${slot.label} ${year}`}</Heading>
                              {matchedItems.length ? (
                                <ul className={styles.mobileFileList}>
                                  {matchedItems.map((item) => (
                                    <li key={item.file_path}>
                                      <DataFileSearchHit dataFile={item} />
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p>
                                  {formatTemplate(localization.dataCoverageTimeline.dataAvailableButFiltered, {
                                    slotLabel: slot.label,
                                    year,
                                  })}
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p>{localization.dataCoverageTimeline.noYearData}</p>
                        ))}
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={year}
                  className={styles.rowWrapper}
                  role='group'
                  aria-label={formatTemplate(localization.dataCoverageTimeline.yearGroupLabel, { year })}
                >
                  <span className={styles.yearLabel} aria-hidden='true'>
                    {year}
                  </span>
                  <div className={styles.track}>
                    {periods.map(({ slot, matchedItems, hasFilteredData, isOutsideSelectedRange }, idx) => (
                      <TimelineCell
                        key={slot.label}
                        slot={slot}
                        idx={idx}
                        totalSlots={periods.length}
                        year={year}
                        isOutsideSelectedRange={isOutsideSelectedRange}
                        matchedItems={matchedItems}
                        hasFilteredData={hasFilteredData}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.axisRow} aria-hidden='true'>
            <div className={styles.axisSpacer} />
            <div className={`${styles.axisLabelsContainer} ${useMonthInitials ? styles.monthAxis : ''}`}>
              {axisSlots.map((slot) => (
                <span key={slot.label} className={styles.axisLabel}>
                  <span className={styles.axisLabelFull}>{slot.label}</span>
                  {useMonthInitials && (
                    <span className={styles.axisLabelCompact} aria-hidden='true'>
                      {slot.label.slice(0, 1)}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
        <ul className={styles.legend}>
          <li className={styles.legendItem}>
            <span className={`${styles.legendSwatch} ${styles.cellFilled}`} aria-hidden='true' />
            <span>{localization.dataCoverageTimeline.statusDataPresent}</span>
          </li>
          <li className={styles.legendItem}>
            <span className={`${styles.legendSwatch} ${styles.cellEmpty}`} aria-hidden='true' />
            <span>{localization.dataCoverageTimeline.statusMissingTargetSegment}</span>
          </li>
          {hasAnyFilteredData ? (
            <li className={styles.legendItem}>
              <span
                className={`${styles.legendSwatch} ${styles.cellEmpty} ${styles.cellFiltered}`}
                aria-hidden='true'
              />
              <span>{localization.dataCoverageTimeline.statusDataAvailableButFiltered}</span>
            </li>
          ) : null}
        </ul>
      </section>
    </>
  );
};

export default DataCoverageTimeline;
