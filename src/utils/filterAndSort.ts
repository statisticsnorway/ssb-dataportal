import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { FilterItem } from '@/types/filters';
import { SortTypes } from '@/types/sort';
import { extractSubjectAreaCode } from './functions';
import { sortAscending, sortDateStringsDescending, sortDescending } from './sort';

export function filterAndSortVariables(
  variables: RenderedView[] | undefined,
  searchTerm: string | undefined,
  subjectFilters: FilterItem[],
  statusFilters: FilterItem[],
  sortOption: SortTypes,
) {
  if (!variables) return [];
  const trimmedSearch = searchTerm?.trim().toLowerCase() || '';

  const matchesStatus = (v: RenderedView) =>
    statusFilters.length === 0 || statusFilters.some((filter) => filter.value === v.variable_status);

  const matchesSubject = (v: RenderedView) =>
    subjectFilters.length === 0 ||
    v.subject_fields.some(
      (ref) =>
        extractSubjectAreaCode(String(ref.code)) &&
        subjectFilters.some((filter) => filter.value === extractSubjectAreaCode(String(ref.code))),
    );

  const matchesSearch = (v: RenderedView) => {
    if (!trimmedSearch) return true;
    return (v.name ?? '').toLowerCase().includes(trimmedSearch);
  };

  return [...variables]
    .filter(matchesSubject)
    .filter(matchesStatus)
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
        default:
          throw sortOption satisfies never;
      }
    });
}
