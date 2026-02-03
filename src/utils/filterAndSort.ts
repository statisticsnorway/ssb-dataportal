import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { FilterItem } from '@/types/filters';
import { sortAscending, sortDateStringsDescending, sortDescending } from './sort';

type TextFilterFields = keyof RenderedView;

export function filterAndSortVariables(
  variables: RenderedView[] | undefined,
  textFilters: Partial<Record<TextFilterFields, string>>,
  subjectFilters: FilterItem[],
  sortOption: 'titleAsc' | 'titleDesc' | 'lastChanged',
) {
  if (!variables) return [];

  const matchesSubject = (v: RenderedView) =>
    subjectFilters.length === 0 ||
    v.subject_fields.some((ref) => ref.code && subjectFilters.some((filter) => filter.code === ref.code));

  const matchesTextFilters = (v: RenderedView) =>
    Object.entries(textFilters).every(([field, value]) => {
      if (!value) return true;
      const key = field as TextFilterFields;
      const fieldValue = v[key];
      return String(fieldValue ?? '')
        .toLowerCase()
        .includes(value.toLowerCase());
    });

  return [...variables]
    .filter(matchesSubject)
    .filter(matchesTextFilters)
    .sort((a, b) => {
      switch (sortOption) {
        case 'titleAsc':
          return sortAscending(a.name || '', b.name || '');
        case 'titleDesc':
          return sortDescending(a.name || '', b.name || '');
        case 'lastChanged':
          return sortDateStringsDescending(
            a.last_updated_at.toISOString().split('T')[0],
            b.last_updated_at.toISOString().split('T')[0],
          );
      }
    });
}
