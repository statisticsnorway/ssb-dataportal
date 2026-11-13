import { Chip } from '@digdir/designsystemet-react';
import type { Slot } from '@/components/data-coverage-timeline/types';
import { CollapsibleCard } from '@/components/filters/collapsible-card';
import { TextFilter } from '@/components/filters/text-filter';
import { Slider } from '@/components/slider';
import { localization } from '@/libs/language';
import { DatasetWorkspace, type DatasetWorkspaceContent } from './DatasetWorkspace';
import styles from './dataset-page.module.css';
import workspaceStyles from './dataset-workspace.module.css';

export type TimelinePeriodSlot = Slot & { year: number };
export type FilterState = {
  search: string;
  period: readonly [number, number] | null;
};

const formatTimelinePeriod = (period: TimelinePeriodSlot | undefined, capitalize = false) => {
  if (!period) return '';
  const label = capitalize ? `${period.label.charAt(0).toLocaleUpperCase()}${period.label.slice(1)}` : period.label;
  return `${label} ${period.year}`;
};

const formatTimelineRange = (periods: TimelinePeriodSlot[]) => {
  const firstPeriod = periods[0];
  const lastPeriod = periods.at(-1);
  if (!firstPeriod || !lastPeriod) return '';
  if (firstPeriod.start === lastPeriod.start && firstPeriod.end === lastPeriod.end) {
    return formatTimelinePeriod(firstPeriod, true);
  }
  return `${formatTimelinePeriod(firstPeriod, true)} – ${formatTimelinePeriod(lastPeriod)}`;
};

/** The periods selected by the slider, where no saved range means all periods. */
export function getSelectedPeriods(timelinePeriods: TimelinePeriodSlot[], period: FilterState['period']) {
  const lastIndex = Math.max(0, timelinePeriods.length - 1);
  const [startIndex, endIndex] = period ?? [0, lastIndex];
  const selected = timelinePeriods.slice(startIndex, endIndex + 1);
  const first = selected[0];
  const last = selected.at(-1);

  return {
    lastIndex,
    startIndex,
    endIndex,
    label: formatTimelineRange(selected),
    range: period && first && last ? { start: first.start, end: last.end } : undefined,
  };
}

type DatasetFiltersProps = Readonly<{
  filters: FilterState;
  timelinePeriods: TimelinePeriodSlot[];
  onChange: (updates: Partial<FilterState>) => void;
  content: DatasetWorkspaceContent;
}>;

export function DatasetFilters({ filters, timelinePeriods, onChange, content }: DatasetFiltersProps) {
  const { lastIndex, startIndex, endIndex, label, range } = getSelectedPeriods(timelinePeriods, filters.period);
  const trimmedSearch = filters.search.trim();
  const hasActiveFilters = trimmedSearch.length > 0 || range !== undefined;
  const onReset = () => onChange({ search: '', period: null });
  const updatePeriodRange = (period: readonly [number, number]) => {
    onChange({ period: period[0] === 0 && period[1] === lastIndex ? null : period });
  };
  const searchControl = (
    <TextFilter
      label={localization.search.textFilter.label}
      searchTerm={filters.search}
      setSearchTerm={(search) => onChange({ search })}
    />
  );
  const periodControl =
    timelinePeriods.length > 0 ? (
      <CollapsibleCard heading={localization.datasetDetail.period} variant='flat' defaultOpen={false}>
        <Slider
          aria-label={localization.datasetDetail.periodRange}
          valueLabel={label}
          rangeLabels={[localization.datasetDetail.periodFrom, localization.datasetDetail.periodTo]}
          value={[startIndex, endIndex]}
          min={0}
          max={lastIndex}
          step={1}
          disabled={lastIndex === 0}
          formatValue={(index) => formatTimelinePeriod(timelinePeriods[index])}
          onChange={updatePeriodRange}
        />
      </CollapsibleCard>
    ) : null;
  const activeFilters = hasActiveFilters ? (
    <div className={workspaceStyles.activeFilters}>
      <Chip.Button className={styles.resetFiltersButton} onClick={onReset}>
        {localization.datasetDetail.resetFilters}
      </Chip.Button>
      <ul className={styles.activeFilterChips} aria-label={localization.filterTag.listLabel} aria-live='polite'>
        {trimmedSearch ? (
          <li>
            <Chip.Removable
              aria-label={`${localization.filterTag.remove} ${localization.search.label}: ${trimmedSearch}`}
              onClick={() => onChange({ search: '' })}
            >
              {`${localization.search.label}: «${trimmedSearch}»`}
            </Chip.Removable>
          </li>
        ) : null}
        {range ? (
          <li>
            <Chip.Removable
              aria-label={`${localization.filterTag.remove} ${localization.datasetDetail.period}: ${label}`}
              onClick={() => onChange({ period: null })}
            >
              {label}
            </Chip.Removable>
          </li>
        ) : null}
      </ul>
    </div>
  ) : null;

  return <DatasetWorkspace {...content} search={searchControl} period={periodControl} activeFilters={activeFilters} />;
}
