import { Chip } from '@digdir/designsystemet-react';
import { localization } from '@/libs/language';
import { FilterItem } from '@/types/filters';
import styles from './filterTags.module.css';
import { useVariableDefinitionsContext } from './variableDefinitionContext';

interface FilterTagsSectionProps {
  onClose: (filter: FilterItem) => void;
  onClearAll: () => void;
  onClearSearch: () => void;
}

export const FilterTagsSection = ({ onClose, onClearAll, onClearSearch }: FilterTagsSectionProps) => {
  const { textFilter, subjectFilters, statusFilters } = useVariableDefinitionsContext();

  const trimmedSearch = textFilter.trim();
  const hasSearch = !!trimmedSearch;
  const activeFilters = subjectFilters.concat(statusFilters);

  if (!hasSearch && activeFilters.length === 0) return null;

  const totalItems = activeFilters.length + (hasSearch ? 1 : 0);

  return (
    <ul className={styles.tagsList}>
      {totalItems > 1 && (
        <li>
          <Chip.Button onClick={onClearAll}>{localization.button.removeFilter}</Chip.Button>
        </li>
      )}
      {hasSearch && (
        <li>
          <Chip.Removable onClick={onClearSearch}>
            {localization.search.textFilter.tagLabel} {trimmedSearch}
          </Chip.Removable>
        </li>
      )}
      {activeFilters.map((filter) => (
        <li key={filter.value}>
          <Chip.Removable onClick={() => onClose(filter)}>{filter.label}</Chip.Removable>
        </li>
      ))}
    </ul>
  );
};
