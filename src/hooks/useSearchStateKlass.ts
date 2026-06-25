import { useEffect, useMemo, useState } from 'react';
import { ClassificationResource } from '@/libs/data-access/klass';
import { SortTypes, sortTypes } from '@/types/sort';
import { sortAscending, sortDatesDescendingSafe, sortDescending } from '@/utils/sort';

export const useSearchStateKlass = (initialHits: ClassificationResource[] = []) => {
  const [sortKey, setSortKey] = useState<SortTypes>('titleAsc');
  const [hits, setHits] = useState<ClassificationResource[]>(initialHits);

  useEffect(() => {
    setHits(initialHits);
  }, [initialHits]);

  const getSortFunction = (key: SortTypes) => {
    switch (key) {
      case 'titleAsc':
        return (a: ClassificationResource, b: ClassificationResource) => sortAscending(a.name, b.name);
      case 'titleDesc':
        return (a: ClassificationResource, b: ClassificationResource) => sortDescending(a.name, b.name);
      case 'lastChanged': {
        return (a: ClassificationResource, b: ClassificationResource) =>
          sortDatesDescendingSafe(a.lastModified, b.lastModified);
      }
      default:
        throw new Error(`Unsupported sort key: ${String(key)}`);
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
