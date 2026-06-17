import { Chip } from '@digdir/designsystemet-react';
import { use, useMemo } from 'react';
import { localization } from '@/libs/language';
import { CLASSIFICATION_TYPE_CATEGORY } from '@/types/classification';
import { FilterItem } from '@/types/filters';
import { mapSelectedSubjectFilters } from '@/utils/filterAndSortClassifications';
import { useClassificationContext } from './classificationContext';
import styles from './filterTags.module.css';

interface FilterTagsSectionProps {
  onClose: (filter: FilterItem) => void;
  onClearAll: () => void;
}

export const FilterTagsSection = ({ onClose, onClearAll }: FilterTagsSectionProps) => {
  const { selectedSubjectCodes, selectedClassificationTypes, subjectFieldsPromise } = useClassificationContext();
  const { data: subjectFields } = use(subjectFieldsPromise);
  const subjectFilters = useMemo(
    () => mapSelectedSubjectFilters(selectedSubjectCodes, subjectFields),
    [selectedSubjectCodes, subjectFields],
  );
  const classificationTypeFilters = useMemo(
    () => selectedClassificationTypes.map((value) => ({ value, label: value, category: CLASSIFICATION_TYPE_CATEGORY })),
    [selectedClassificationTypes],
  );
  const allFilters = [...subjectFilters, ...classificationTypeFilters];

  if (allFilters.length === 0) return null;

  return (
    <ul className={styles.tagsList}>
      {allFilters.length > 1 && (
        <li>
          <Chip.Button onClick={onClearAll}>{localization.button.removeFilter}</Chip.Button>
        </li>
      )}
      {allFilters.map((filter) => (
        <li key={filter.value}>
          <Chip.Removable onClick={() => onClose(filter)}>{filter.label}</Chip.Removable>
        </li>
      ))}
    </ul>
  );
};
