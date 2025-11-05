import { Classification } from "@/types/classification";
import { sortAscending, sortDateStringsDescending, sortDescending } from "@/utils/sort";
import { useEffect, useMemo, useState } from "react";

const sortTypes: SortTypes[] = ['titleAsc', 'titleDesc', 'lastChanged'];

export type SortTypes = 'titleAsc' | 'titleDesc' | 'lastChanged';

export const useSearchStateKlass = (initialHits: Classification[] = []) => {
    const [sortKey, setSortKey] = useState<SortTypes>('titleAsc');
    const [hits, setHits] = useState<Classification[]>(initialHits);

    useEffect(() => {
        setHits(initialHits);
    }, [initialHits]);
    
    const getSortFunction = (key: SortTypes) => {
        switch (key) {
            case 'titleAsc':
                return (a: Classification, b: Classification) =>
                    sortAscending(a.name || '', b.name || '');
            case 'titleDesc':
                return (a: Classification, b: Classification) =>
                    sortDescending(a.name || '', b.name || '');
            case 'lastChanged':
                return (a: Classification, b: Classification) =>
                    sortDateStringsDescending(a.lastModified || '', b.lastModified || '');
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

