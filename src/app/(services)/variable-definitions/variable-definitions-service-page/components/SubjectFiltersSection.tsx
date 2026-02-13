'use client';

import { use, useMemo } from 'react';
import { CheckboxFilter } from '@/components/filters/checkbox-filter';
import { CodeItem } from '@/libs/data-access/klass/models';
import { localization } from '@/libs/language/src/localization';
import { FilterItem } from '@/types/filters';

interface SubjectFiltersSectionProps {
  subjectFieldsPromise: Promise<{ data: CodeItem[]; error: Error | null }>;
  selectedItems: FilterItem[];
  onFilterChange: (filter: FilterItem) => void;
}

/**
 * FiltersSection renders a checkbox-based filter for subject areas.
 *
 * It resolves the provided `subjectFieldsPromise`, transforms the returned
 * subject fields into filter items, sorts them alphabetically by label,
 * and passes them to the `CheckboxFilter` component.
 *
 * @param subjectFieldsPromise - Promise resolving to subject field data.
 * @param selectedItems - The currently selected filter items.
 * @param onFilterChange - Callback triggered when a filter item is toggled.
 *
 * @returns A CheckboxFilter component populated with sorted subject filters.
 */
export const SubjectFiltersSection = ({
  subjectFieldsPromise,
  selectedItems,
  onFilterChange,
}: SubjectFiltersSectionProps) => {
  const { data: subjectFields } = use(subjectFieldsPromise);
  const subjectFilterItems = useMemo(
    () =>
      subjectFields
        .map((f) => ({ label: String(f.name), value: String(f.code) }))
        .sort((a, b) => a.label.localeCompare(b.label)),
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
