import { useEffect, useMemo, useState } from 'react';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { SortTypes, sortTypes } from '@/types/sort';
import { sortAscending, sortDateStringsDescending, sortDescending } from '@/utils/sort';

export const useSearchStateVardef = (initialHits: RenderedView[] = []) => {
  const [sortKey, setSortKey] = useState<SortTypes>('titleAsc');
  const [hits, setHits] = useState<RenderedView[]>(initialHits);

  useEffect(() => {
    setHits(initialHits);
  }, [initialHits]);

  const getSortFunction = (key: SortTypes) => {
    switch (key) {
      case 'titleAsc':
        return (a: RenderedView, b: RenderedView) => sortAscending(a.name, b.name);
      case 'titleDesc':
        return (a: RenderedView, b: RenderedView) => sortDescending(a.name, b.name);
      case 'lastChanged':
        return (a: RenderedView, b: RenderedView) =>
          sortDateStringsDescending(
            a.last_updated_at.toISOString().split('T')[0] || '',
            b.last_updated_at.toISOString().split('T')[0] || '',
          );
      default:
        throw key satisfies never;
    }
  };

  const sortedHits = useMemo(() => {
    const sortFn = getSortFunction(sortKey);
    return [...hits].sort(sortFn);
  }, [hits, sortKey]);

  return {
    hits: sortedHits,
    setHits,
    sortKey,
    setSortKey,
    sortTypes,
  };
};
