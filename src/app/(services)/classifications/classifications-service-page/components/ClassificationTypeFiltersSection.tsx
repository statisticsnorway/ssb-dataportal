'use client';

import { use, useMemo } from 'react';
import { CheckboxFilter } from '@/components/filters';
import { ClassificationResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import { CLASSIFICATION_TYPE_CATEGORY, ClassificationType } from '@/types/classification';
import { FilterItem } from '@/types/filters';
import { useClassificationContext } from './classificationContext';

function getTypeFilterItems(classifications: ClassificationResource[]): FilterItem[] {
  return [ClassificationType.Klassifikasjon, ClassificationType.Kodeliste].map((value) => ({
    label: value,
    value,
    count: classifications.filter((c) => c.classificationType === value).length,
    category: CLASSIFICATION_TYPE_CATEGORY,
  }));
}

interface ClassificationTypeFiltersSectionProps {
  onFilterChange: (filter: FilterItem) => void;
}

export const ClassificationTypeFiltersSection = ({ onFilterChange }: ClassificationTypeFiltersSectionProps) => {
  const { classificationsPromise, selectedClassificationTypes } = useClassificationContext();
  const { data: classifications } = use(classificationsPromise);

  const filterItems = useMemo(() => getTypeFilterItems(classifications), [classifications]);
  const selectedItems = useMemo(
    () => selectedClassificationTypes.map((value) => ({ value, label: value, category: CLASSIFICATION_TYPE_CATEGORY })),
    [selectedClassificationTypes],
  );

  return (
    <CheckboxFilter
      filterHeading={localization.classification.type}
      filters={filterItems}
      selectedItems={selectedItems}
      onFilterChange={onFilterChange}
    />
  );
};
