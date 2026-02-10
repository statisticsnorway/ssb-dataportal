'use client';

import { use, useMemo } from 'react';
import { CheckboxFilter } from '@/components/filters/checkbox-filter';
import { CodeItem } from '@/libs/data-access/klass/models';
import { localization } from '@/libs/language/src/localization';
import { FilterItem } from '@/types/filters';

interface FiltersSectionProps {
  subjectFieldsPromise: Promise<{ data: CodeItem[]; error: any }>;
  selectedItems: FilterItem[];
  onFilterChange: (filter: FilterItem) => void;
}

export const FiltersSection = ({
  subjectFieldsPromise,
  selectedItems,
  onFilterChange,
}: FiltersSectionProps) => {
  const { data: subjectFields } = use(subjectFieldsPromise);
  const subjectFilterItems = useMemo(
    () => subjectFields.map((f) => ({ label: String(f.name), value: String(f.code) })),
    [subjectFields],
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
