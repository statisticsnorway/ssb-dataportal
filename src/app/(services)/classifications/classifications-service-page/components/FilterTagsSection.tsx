import { Chip } from '@digdir/designsystemet-react';
import { use, useMemo } from 'react';
import styles from '@/components/tag-components/filter-tags/filter-tags.module.css';
import { localization } from '@/libs/language';
import { FilterItem } from '@/types/filters';
import { mapSelectedClassificationTypeFilters, mapSelectedSubjectFilters } from '@/utils/filterAndSortClassifications';
import { useClassificationContext } from './classificationContext';

interface FilterTagsSectionProps {
  onCloseSubject: (filter: FilterItem) => void;
  onCloseClassificationType: (filter: FilterItem) => void;
  onClearAll: () => void;
}

export const FilterTagsSection = ({
  onCloseSubject,
  onCloseClassificationType,
  onClearAll,
}: FilterTagsSectionProps) => {
  const { selectedSubjectCodes, selectedClassificationTypes, subjectFieldsPromise } = useClassificationContext();
  const { data: subjectFields } = use(subjectFieldsPromise);
  const subjectFilters = useMemo(
    () => mapSelectedSubjectFilters(selectedSubjectCodes, subjectFields),
    [selectedSubjectCodes, subjectFields],
  );
  const classificationTypeFilters = useMemo(
    () => mapSelectedClassificationTypeFilters(selectedClassificationTypes),
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
      {subjectFilters.map((filter) => (
        <li key={filter.value}>
          <Chip.Removable onClick={() => onCloseSubject(filter)}>{filter.label}</Chip.Removable>
        </li>
      ))}
      {classificationTypeFilters.map((filter) => (
        <li key={filter.value}>
          <Chip.Removable onClick={() => onCloseClassificationType(filter)}>{filter.label}</Chip.Removable>
        </li>
      ))}
    </ul>
  );
};
