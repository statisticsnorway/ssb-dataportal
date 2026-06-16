'use client';

import { use, useMemo } from 'react';
import { CheckboxFilter } from '@/components/filters';
import { localization } from '@/libs/language';
import { FilterItem } from '@/types/filters';
import {
  createClassificationTypeFilterItems,
  mapSelectedClassificationTypeFilters,
} from '@/utils/filterAndSortClassifications';
import { useClassificationContext } from './classificationContext';

interface ClassificationTypeFiltersSectionProps {
  onFilterChange: (filter: FilterItem) => void;
}

export const ClassificationTypeFiltersSection = ({ onFilterChange }: ClassificationTypeFiltersSectionProps) => {
  const { classificationsPromise, selectedClassificationTypes } = useClassificationContext();

  const { data: classifications } = use(classificationsPromise);

  const filterItems = useMemo(() => createClassificationTypeFilterItems(classifications), [classifications]);

  const selectedItems = useMemo(
    () => mapSelectedClassificationTypeFilters(selectedClassificationTypes),
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
