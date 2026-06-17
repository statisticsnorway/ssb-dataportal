import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { FilterItem } from '@/types/filters';
import { SortTypes } from '@/types/sort';
import { getParentCode } from './functions';
import { sortAscending, sortDateStringsDescending, sortDescending } from './sort';

const getSearchableNames = (variable: RenderedView) => [
  (variable.name ?? '').toLowerCase(),
  (variable.short_name ?? '').toLowerCase(),
];

const getSearchPriority = (variable: RenderedView, trimmedSearch: string) => {
  const names = getSearchableNames(variable);
  if (names.includes(trimmedSearch)) return 0;
  if (names.some((name) => name.startsWith(trimmedSearch))) return 1;
  if (names.some((name) => name.includes(trimmedSearch))) return 2;

  return Number.POSITIVE_INFINITY;
};

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
        getParentCode(String(ref.code)) &&
        subjectFilters.some((filter) => filter.value === getParentCode(String(ref.code))),
    );

  const matchesSearch = (v: RenderedView) => {
    if (!trimmedSearch) return true;
    return getSearchPriority(v, trimmedSearch) !== Number.POSITIVE_INFINITY;
  };

  const sortBySelectedOption = (a: RenderedView, b: RenderedView) => {
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
  };

  return [...variables]
    .filter(matchesSubject)
    .filter(matchesStatus)
    .filter(matchesSearch)
    .sort((a, b) => {
      if (!trimmedSearch) return sortBySelectedOption(a, b);
      return getSearchPriority(a, trimmedSearch) - getSearchPriority(b, trimmedSearch) || sortBySelectedOption(a, b);
    });
}
