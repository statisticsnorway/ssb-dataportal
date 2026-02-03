import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { FilterItem } from '@/types/filters';
import { sortAscending, sortDateStringsDescending, sortDescending } from './sort';

export function filterAndSortVariables(
  variables: RenderedView[] | undefined,
  searchTerm: string | undefined,
  subjectFilters: FilterItem[],
  sortOption: 'titleAsc' | 'titleDesc' | 'lastChanged',
) {
  if (!variables) return [];
  const trimmedSearch = searchTerm?.trim().toLowerCase() || '';

  const matchesSubject = (v: RenderedView) =>
    subjectFilters.length === 0 ||
    v.subject_fields.some((ref) => ref.code && subjectFilters.some((filter) => filter.code === ref.code));

  const matchesSearch = (v: RenderedView) => {
    if (!trimmedSearch) return true;
    return (v.name ?? '').toLowerCase().includes(trimmedSearch);
  };

  return [...variables]
    .filter(matchesSubject)
    .filter(matchesSearch)
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
