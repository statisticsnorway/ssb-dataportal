import { Chip } from '@digdir/designsystemet-react';
import { localization } from '@/libs/language';
import type { FilterItem } from '@/types/filters';
import styles from './filter-tags-section.module.css';

interface FilterTagsSectionProps {
  tags: FilterItem[];
  onRemoveTag: (tag: FilterItem) => void;
  onClearAll: () => void;
  searchTerm?: string;
  onClearSearch?: () => void;
}

export const FilterTagsSection = ({
  tags,
  onRemoveTag,
  onClearAll,
  searchTerm,
  onClearSearch,
}: FilterTagsSectionProps) => {
  const trimmedSearch = searchTerm?.trim() ?? '';
  const hasSearch = trimmedSearch.length > 0;

  if (!hasSearch && tags.length === 0) {
    return null;
  }

  const totalItems = tags.length + (hasSearch ? 1 : 0);

  return (
    <ul className={styles.tagsList} aria-label={localization.filterTag.listLabel}>
      {totalItems > 1 && (
        <li>
          <Chip.Button onClick={onClearAll}>{localization.button.removeFilter}</Chip.Button>
        </li>
      )}

      {hasSearch && onClearSearch && (
        <li>
          <Chip.Removable
            aria-label={`${localization.filterTag.remove} ${localization.search.textFilter.tagLabel} ${trimmedSearch}`}
            onClick={onClearSearch}
          >
            {localization.search.textFilter.tagLabel} {trimmedSearch}
          </Chip.Removable>
        </li>
      )}

      {tags.map((tag) => {
        const label = tag.label ?? tag.value;

        return (
          <li key={tag.value}>
            <Chip.Removable aria-label={`${localization.filterTag.remove} ${label}`} onClick={() => onRemoveTag(tag)}>
              {label}
            </Chip.Removable>
          </li>
        );
      })}
    </ul>
  );
};
