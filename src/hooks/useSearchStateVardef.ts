import { useEffect, useMemo, useState } from 'react';
import { VariableDefinitionType } from '@/types/variableDefinition';
import { sortAscending, sortDateStringsDescending, sortDescending } from '@/utils/sort';

const sortTypes: SortTypes[] = ['titleAsc', 'titleDesc', 'lastChanged'];

export type SortTypes = 'titleAsc' | 'titleDesc' | 'lastChanged';

export const useSearchStateVardef = (initialHits: VariableDefinitionType[] = []) => {
  const [sortKey, setSortKey] = useState<SortTypes>('titleAsc');
  const [hits, setHits] = useState<VariableDefinitionType[]>(initialHits);

  useEffect(() => {
    setHits(initialHits);
  }, [initialHits]);

  const getSortFunction = (key: SortTypes) => {
    switch (key) {
      case 'titleAsc':
        return (a: VariableDefinitionType, b: VariableDefinitionType) => sortAscending(a.name || '', b.name || '');
      case 'titleDesc':
        return (a: VariableDefinitionType, b: VariableDefinitionType) => sortDescending(a.name || '', b.name || '');
      case 'lastChanged':
        return (a: VariableDefinitionType, b: VariableDefinitionType) =>
          sortDateStringsDescending(a.last_updated_at || '', b.last_updated_at || '');
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
