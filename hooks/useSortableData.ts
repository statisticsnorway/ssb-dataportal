import { useEffect, useMemo, useState } from "react";

export type SortOption<T> = {
    key: string;
    label: string;
    sortFn: (a: T, b: T) => number;
};

export const useSortableData = <T,>(
    initialData: T[] = [],
    sortOptions: SortOption<T>[],
    defaultSortKey?: string
) => {
    const [data, setData] = useState<T[]>(initialData);
    const [sortKey, setSortKey] = useState<string>(defaultSortKey || sortOptions[0]?.key);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const sortedData = useMemo(() => {
        const sortOption = sortOptions.find((opt) => opt.key === sortKey);
        return sortOption ? [...data].sort(sortOption.sortFn) : data;
    }, [data, sortKey, sortOptions]);

    return {
        data: sortedData,
        setData,
        sortKey,
        setSortKey,
        sortOptions,
    };
};
