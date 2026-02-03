import { localization } from '@/libs/language/src/localization';
import { FilterItem } from '@/types/filters';
import { FilterTag } from './filter-tag';
import styles from './filter-tags.module.css';

interface TagsGroupProps {
  activeFilters: FilterItem[];
  searchTerms?: Record<string, string>;
  onClose?: (key: FilterItem) => void;
  onClearAll: () => void;
  onClearSearch?: (key: string) => void;
}

/**
 * TagsGroup component displays a list of tags with optional close buttons.
 *
 * @param tagData - Map of tag keys and their corresponding labels.
 * @param onClose - Callback triggered when a tag's close button is clicked.
 * @param onClearAll - Optional "Remove All" button configuration.
 *
 * @returns An unordered list (<ul>) of tags, optionally with close buttons and a "Remove All" button
 * or null if tagData is empty.
 */
const FilterTags = ({ activeFilters, searchTerms, onClose, onClearAll, onClearSearch }: TagsGroupProps) => {
  const searchEntries = Object.entries(searchTerms ?? {})
    .map(([key, value]) => [key, value.trim()] as const)
    .filter(([, value]) => value.length > 0);

  const hasSearch = searchEntries.length > 0;
  const hasFilters = activeFilters.length > 0;

  if (!hasSearch && !hasFilters) return null;

  const showClearAll = activeFilters.length + searchEntries.length > 1;

  return (
    <ul className={styles.tagsList}>
      {showClearAll && <FilterTag label={localization.button.removeFilter} onClose={onClearAll} isClearAll />}

      {searchEntries.map(([key, value]) => (
        <FilterTag
          key={key}
          label={`Søk: ${value}`} //TODO - move to localization
          onClose={onClearSearch ? () => onClearSearch(key) : undefined}
        />
      ))}

      {activeFilters.map((item) => (
        <FilterTag key={item.code} label={item.name} onClose={onClose ? () => onClose(item) : undefined} />
      ))}
    </ul>
  );
};

export { FilterTags };
