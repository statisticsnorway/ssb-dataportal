import { Spinner } from '@digdir/designsystemet-react';
import { CheckboxFilter } from '@/components/filters';
import { localization } from '@/libs/language';
import { FilterItem } from '@/types/filters';
import { mapSelectedSubjectFilters } from '@/utils/classifications/filterAndSortClassifications';
import { useDataProductsContext } from './dataProductsContext';

interface SubjectFiltersSectionProps {
  onFilterChange: (filter: FilterItem) => void;
}

export const SubjectFiltersSection = ({ onFilterChange }: SubjectFiltersSectionProps) => {
  const { subjectFieldFilters, selectedSubjectCodes, subjectFields } = useDataProductsContext();
  const selectedItems = mapSelectedSubjectFilters(selectedSubjectCodes, subjectFields);

  return (
    <CheckboxFilter
      filterHeading={localization.subjectArea}
      filters={subjectFieldFilters}
      selectedItems={selectedItems}
      onFilterChange={onFilterChange}
    />
  );
};

export const SubjectFiltersSectionFallback = () => <Spinner aria-label={localization.loading.filters} />;
