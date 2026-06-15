import { Chip } from '@digdir/designsystemet-react';
import { use, useMemo } from 'react';
import styles from '@/components/tag-components/filter-tags/filter-tags.module.css';
import { localization } from '@/libs/language';
import { FilterItem } from '@/types/filters';
import { mapSelectedSubjectFilters } from '@/utils/filterAndSortClassifications';
import { useClassificationContext } from './classificationContext';

interface FilterTagsSectionProps {
  onClose: (filter: FilterItem) => void;
  onClearAll: () => void;
}

export const FilterTagsSection = ({ onClose, onClearAll }: FilterTagsSectionProps) => {
  const { selectedSubjectCodes, subjectFieldsPromise } = useClassificationContext();
  const { data: subjectFields } = use(subjectFieldsPromise);

  const subjectFilters = useMemo(
    () => mapSelectedSubjectFilters(selectedSubjectCodes, subjectFields),
    [selectedSubjectCodes, subjectFields],
  );

  if (subjectFilters.length === 0) {
    return null;
  }

  return (
    <ul className={styles.tagsList}>
      {subjectFilters.length > 1 ? (
        <li>
          <Chip.Button onClick={onClearAll}>{localization.button.removeFilter}</Chip.Button>
        </li>
      ) : null}

      {subjectFilters.map((filter) => (
        <li key={filter.value}>
          <Chip.Removable onClick={() => onClose(filter)}>{filter.label}</Chip.Removable>
        </li>
      ))}
    </ul>
  );
};
