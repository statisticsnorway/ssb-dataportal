import { Button, Heading, Popover } from '@digdir/designsystemet-react';
import classNames from 'classnames';
import React, { useId, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { DataFileSearchHit } from '@/app/(details)/data-products/[shortName]/components/DataFileSearchHit';
import { localization } from '@/libs/language/src/localization';
import styles from './dataCoverageTimeline.module.css';
import { type Slot, type TimelineItem } from './types';
import { type TimelineData } from './useTimelineData';

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

interface PeriodStatus {
  slot: Slot;
  matchedItems: TimelineItem[];
  hasFilteredData: boolean;
  isOutsideSelectedRange: boolean;
}

interface CellProps extends PeriodStatus {
  idx: number;
  totalSlots: number;
  year: number;
}

/**
 * Renders a single slot cell within a year's timeline row.
 *
 * Shows a filled or empty visual state and attaches a Popover with details when present.
 *
 * @param slot        - Slot definition to render.
 * @param idx         - Zero-based index of the slot within the year.
 * @param totalSlots  - Total slots in the year, used to identify the final slot.
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
  const text = localization.dataCoverageTimeline;
  const baseValues = { slotLabel: slot.label, year };
  const hasData = matchedItems.length > 0;
  const isFirst = idx === 0;
  const isLast = idx === totalSlots - 1;
  const dataPresentTitle = `${slot.label} ${year}`;
  const baseTooltip = `${text.tooltipStatusMissingTargetSegment}: ${dataPresentTitle}`;

  const fileCountLabel = `${matchedItems.length} ${matchedItems.length === 1 ? text.availableDataFileLabel : text.availableDataFileLabelPlural}`;
  let emptyMessage = baseTooltip;
  if (hasFilteredData) {
    emptyMessage = formatTemplate(text.dataAvailableButFiltered, baseValues);
  } else if (isOutsideSelectedRange) {
    emptyMessage = formatTemplate(text.outsideSelectedPeriodRange, baseValues);
  }
  const triggerLabel = hasData
    ? `${text.tooltipStatusDataPresent}: ${dataPresentTitle}. ${fileCountLabel}`
    : emptyMessage;

  return (
    <Popover.TriggerContext>
      <div className={styles.cellSegment}>
        <div
          aria-hidden='true'
          className={classNames(
            styles.cell,
            hasData ? styles.cellFilled : styles.cellEmpty,
            hasFilteredData && styles.cellFiltered,
            isFirst && styles.cellFirst,
            isLast && styles.cellLast,
          )}
        />
        <Popover.Trigger aria-label={triggerLabel} className={styles.cellTrigger} />
      </div>
      <Popover
        placement='top'
        data-autoplacement='true'
        className={classNames(
          styles.timelinePopover,
          hasData ? styles.timelinePopoverFilled : styles.timelinePopoverEmpty,
        )}
      >
        {hasData ? (
          <div className={styles.popoverContent}>
            <div className={styles.popoverTitle}>{dataPresentTitle}</div>
            <div>{fileCountLabel}:</div>
            <div className={styles.popoverList}>
              {matchedItems.map((dataFile) => (
                <DataFileSearchHit dataFile={dataFile} key={dataFile.file_path} />
              ))}
            </div>
          </div>
        ) : (
          emptyMessage
        )}
      </Popover>
    </Popover.TriggerContext>
  );
};

interface MobileTimelineYearProps {
  year: number;
  periods: PeriodStatus[];
  open: boolean;
  panelId: string;
  onToggle: () => void;
}

interface MobileTimelinePeriodProps {
  period: PeriodStatus;
  year: number;
}

const MobileTimelinePeriod = ({ period, year }: MobileTimelinePeriodProps) => {
  const { slot, matchedItems, hasFilteredData } = period;
  const text = localization.dataCoverageTimeline;

  if (matchedItems.length > 0) {
    return (
      <ul className={styles.mobileFileList}>
        {matchedItems.map((item) => (
          <li key={item.file_path}>
            <DataFileSearchHit dataFile={item} />
          </li>
        ))}
      </ul>
    );
  }

  if (hasFilteredData) {
    return <p>{formatTemplate(text.dataAvailableButFiltered, { slotLabel: slot.label, year })}</p>;
  }

  return <p>{text.statusMissingTargetSegment}</p>;
};

const MobileTimelineYear = ({ year, periods, open, panelId, onToggle }: MobileTimelineYearProps) => {
  const text = localization.dataCoverageTimeline;
  const hasYearData = periods.some(({ matchedItems, hasFilteredData }) => matchedItems.length > 0 || hasFilteredData);
  let panelContent: React.ReactNode = null;

  if (open && hasYearData) {
    panelContent = periods.map((period) => (
      <div key={period.slot.label}>
        <Heading level={3} data-size='xs'>{`${period.slot.label} ${year}`}</Heading>
        <MobileTimelinePeriod period={period} year={year} />
      </div>
    ));
  } else if (open) {
    panelContent = <p>{text.noYearData}</p>;
  }

  return (
    <div>
      <Button
        variant='tertiary'
        className={styles.mobileYearButton}
        aria-label={formatTemplate(open ? text.hideYear : text.showYear, { year })}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className={styles.yearLabel}>{year}</span>
        <span className={styles.mobileTrack} aria-hidden='true'>
          {periods.map(({ slot, matchedItems, hasFilteredData }) => (
            <span
              key={slot.label}
              className={classNames(
                styles.mobileSegment,
                matchedItems.length > 0 ? styles.cellFilled : styles.cellEmpty,
                matchedItems.length === 0 && hasFilteredData && styles.cellFiltered,
              )}
            />
          ))}
        </span>
      </Button>
      <div id={panelId} hidden={!open} className={styles.mobileFiles}>
        {panelContent}
      </div>
    </div>
  );
};

/**
 * Renders the full data coverage timeline.
 *
 * One row is rendered per year, each divided into slots whose granularity
 * (month, quarter, half-year, etc.) is driven by the dataset's `period_type` field.
 * The axis row at the bottom mirrors the first year's slot labels so they
 * always stay in sync with the grid.
 *
 * Renders nothing when `isValid` is false (e.g. mixed `period_type` values).
 *
 */
type DataCoverageTimelineProps = Pick<TimelineData, 'isValid' | 'allItems' | 'years' | 'slots'> & {
  unfilteredItems?: TimelineItem[];
  selectedPeriodRange?: { start: string; end: string };
};

const DataCoverageTimeline = ({
  isValid,
  allItems,
  unfilteredItems = allItems,
  years,
  slots,
  selectedPeriodRange,
}: DataCoverageTimelineProps) => {
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
          (slots[year] ?? []).map((slot): PeriodStatus => {
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
                return (
                  <MobileTimelineYear
                    key={year}
                    year={year}
                    periods={periods}
                    open={open}
                    panelId={panelId}
                    onToggle={() => setExpandedYear(open ? null : year)}
                  />
                );
              }
              return (
                <div key={year} className={styles.rowWrapper}>
                  <span className={styles.yearLabel} aria-hidden='true'>
                    {year}
                  </span>
                  <fieldset className={styles.track}>
                    <legend className='ds-sr-only'>
                      {formatTemplate(localization.dataCoverageTimeline.yearGroupLabel, { year })}
                    </legend>
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
                  </fieldset>
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
                  {useMonthInitials && <span className={styles.axisLabelCompact}>{slot.label.slice(0, 1)}</span>}
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
