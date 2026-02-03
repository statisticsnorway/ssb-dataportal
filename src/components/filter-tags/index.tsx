import { localization } from '@/libs/language/src/localization';
import { FilterItem } from '@/types/filters';
import { FilterTag } from './filter-tag';
import styles from './filter-tags.module.css';

interface TagsGroupProps {
  activeFilters: FilterItem[];
  searchTerm?: string;
  onClose?: (key: FilterItem) => void;
  onClearAll: () => void;
  onClearSearch?: () => void;
}

/**
 * FilterTags component displays a list of tags with optional close buttons.
 *
 * @param activeFilters - List of active filters.
 * @param searchTerm - Optional search string.
 * @param onClose - Callback when a filter tag is closed.
 * @param onClearAll - Callback to remove all tags.
 * @param onClearSearch - Callback to remove the search term.
 *
 * @returns An unordered list (<ul>) of tags, optionally with close buttons and a "Remove All" button,
 * or null if no filters or search term exist.
 */
const FilterTags = ({ activeFilters, searchTerm, onClose, onClearAll, onClearSearch }: TagsGroupProps) => {
  const trimmedSearch = searchTerm?.trim();
  const hasSearch = !!trimmedSearch;
  const hasFilters = activeFilters.length > 0;

  if (!hasSearch && !hasFilters) return null;
  const showClearAll = activeFilters.length + (hasSearch ? 1 : 0) > 1;

  return (
    <ul className={styles.tagsList}>
      {showClearAll && <FilterTag label={localization.button.removeFilter} onClose={onClearAll} isClearAll />}

      {hasSearch && (
        <FilterTag label={`${localization.search.textFilter.tagLabel} ${trimmedSearch}`} onClose={onClearSearch} />
      )}

      {activeFilters.map((item) => (
        <FilterTag key={item.value} label={item.label} onClose={onClose ? () => onClose(item) : undefined} />
      ))}
    </ul>
  );
};

export { FilterTags };
