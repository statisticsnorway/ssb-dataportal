import { Spinner } from '@statisticsnorway/design-react';
import { use, useMemo } from 'react';
import { CheckboxFilter } from '@/components/filters';
import { localization } from '@/libs/language';
import { FilterItem } from '@/types/filters';
import { createSubjectFieldFilterItems, mapSelectedSubjectFilters } from '@/utils/filterAndSortClassifications';
import { useClassificationContext } from './classificationContext';

interface SubjectFiltersSectionProps {
  onFilterChange: (filter: FilterItem) => void;
}

export const SubjectFiltersSection = ({ onFilterChange }: SubjectFiltersSectionProps) => {
  const { classificationsPromise, subjectFieldsPromise, selectedSubjectCodes } = useClassificationContext();

  const { data: classifications } = use(classificationsPromise);
  const { data: subjectFields } = use(subjectFieldsPromise);

  const subjectFilterItems = useMemo(
    () => createSubjectFieldFilterItems(classifications, subjectFields),
    [classifications, subjectFields],
  );

  const selectedItems = useMemo(
    () => mapSelectedSubjectFilters(selectedSubjectCodes, subjectFields),
    [selectedSubjectCodes, subjectFields],
  );

  return (
    <CheckboxFilter
      filterHeading={localization.subjectArea}
      filters={subjectFilterItems}
      selectedItems={selectedItems}
      onFilterChange={onFilterChange}
    />
  );
};

export const SubjectFiltersSectionFallback = () => <Spinner aria-label={localization.loading.filters} />;
