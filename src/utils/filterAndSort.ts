import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { FilterItem } from '@/types/filters';
import { sortAscending, sortDateStringsDescending, sortDescending } from './sort';

export function filterAndSortVariables(
  variables: RenderedView[] | undefined,
  textFilters: Record<string, string>, // e.g., { name: 'foo', definition: 'bar' }
  subjectFilters: FilterItem[],
  sortOption: 'titleAsc' | 'titleDesc' | 'lastChanged',
) {
  if (!variables) return [];

  let filtered = [...variables];

  filtered = filtered.filter(
    (v) =>
      subjectFilters.length === 0 ||
      v.subject_fields.some((ref) => ref.code && subjectFilters.some((filter) => filter.code === ref.code)),
  );

  Object.entries(textFilters).forEach(([field, value]) => {
    filtered = filtered.filter((v) => !value || (v as any)[field]?.toLowerCase().includes(value.toLowerCase()));
  });

  return filtered.sort((a, b) => {
    switch (sortOption) {
      case 'titleAsc':
        return sortAscending(a.name || '', b.name || '');
      case 'titleDesc':
        return sortDescending(a.name || '', b.name || '');
      case 'lastChanged':
        return sortDateStringsDescending(
          a.last_updated_at.toISOString().split('T')[0] || '',
          b.last_updated_at.toISOString().split('T')[0] || '',
        );
    }
  });
}
