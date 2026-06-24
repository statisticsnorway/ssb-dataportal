'use client';

import { use, useMemo } from 'react';
import { CheckboxFilter } from '@/components/filters';
import { ClassificationResource } from '@/libs/data-access/klass/models';
import { localization } from '@/libs/language';
import { CLASSIFICATION_TYPE_CATEGORY } from '@/types/classification';
import { FilterItem } from '@/types/filters';
import { getLabelForClassificationType } from '@/utils/classifications/classificationHelpers';
import { createTypeFilterItems } from '@/utils/classifications/filterAndSortClassifications';
import { useClassificationContext } from './classificationContext';

interface ClassificationTypeFiltersSectionProps {
  onFilterChange: (filter: FilterItem) => void;
}

export const ClassificationTypeFiltersSection = ({ onFilterChange }: ClassificationTypeFiltersSectionProps) => {
  const { classificationsPromise, selectedClassificationTypes } = useClassificationContext();
  const { data: classifications } = use(classificationsPromise);

  const filterItems = useMemo(() => createTypeFilterItems(classifications), [classifications]);
  const selectedItems = useMemo(
    () =>
      selectedClassificationTypes.map((value) => ({
        value,
        label: getLabelForClassificationType({ classificationType: value } as ClassificationResource),
        category: CLASSIFICATION_TYPE_CATEGORY,
      })),
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
