import { useEffect, useMemo, useState } from 'react';
import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { sortAscending, sortDateStringsDescending, sortDescending } from '@/utils/sort';

const sortTypes: SortTypes[] = ['titleAsc', 'titleDesc', 'lastChanged'];

export type SortTypes = 'titleAsc' | 'titleDesc' | 'lastChanged';

export const useSearchStateVardef = (initialHits: CompleteResponse[] = []) => {
  const [sortKey, setSortKey] = useState<SortTypes>('titleAsc');
  const [hits, setHits] = useState<CompleteResponse[]>(initialHits);

  useEffect(() => {
    setHits(initialHits);
  }, [initialHits]);

  const getSortFunction = (key: SortTypes) => {
    switch (key) {
      case 'titleAsc':
        return (a: CompleteResponse, b: CompleteResponse) => sortAscending(a.name.nb || '', b.name.nb || '');
      case 'titleDesc':
        return (a: CompleteResponse, b: CompleteResponse) => sortDescending(a.name.nb || '', b.name.nb || '');
      case 'lastChanged':
        return (a: CompleteResponse, b: CompleteResponse) =>
          sortDateStringsDescending(a.lastUpdatedAt.toISOString().split('T')[0] || '', b.lastUpdatedAt.toISOString().split('T')[0] || '');
      default:
        return () => 0;
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
