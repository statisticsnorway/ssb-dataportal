'use client';

import { FiltersPanel } from '@/components/filters-panel';
import { SearchHitContainer } from '@/components/search-hits-container';
import { SearchHitsLayout } from '@/components/search-hits-layout';
import SortFields from '@/components/sort-fields';
import { SortTypes, useSearchStateKlass } from '@/hooks/useSearchStateKlass';
import { Classification } from '@/types/classification';
import { FilterGroup } from '@/types/filters';
import React, { useMemo } from 'react';
import { ClassificationSearchHit } from './classificationSearchHit';
import { localization } from '@/utils/src';

interface ClassificationServicePageProps {
    rawHits: Classification[];
    isLoading?: boolean;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    filterGroups: FilterGroup[];
}

const ClassificationsServicePage = ({
    rawHits,
    isLoading,
    currentPage,
    totalPages,
    onPageChange,
    filterGroups,
}: ClassificationServicePageProps) => {
    const memoizedHits = useMemo(() => (isLoading ? [] : rawHits), [isLoading, rawHits]);

    const { hits, sortKey, setSortKey, sortTypes } = useSearchStateKlass(memoizedHits);

    const isLoadingToDisplay = isLoading;

    console.log(
        'Filters: ',
        filterGroups.map((filterGroup) => filterGroup.selectedItems),
    );

    return (
        <SearchHitsLayout
            filterContent={
                <FiltersPanel filterGroups={filterGroups}/>
            } 
            mainContent={
                    <>
                        <SortFields
                            sortOptions={sortTypes}
                            sortValue={sortKey}
                            onSortChange={(key: string) => setSortKey(key as SortTypes)}
                        />
                        {isLoading ? (
                        <div>Loading...</div>
                            ) : hits.length === 0 ? (
                            <div>{localization.search.noHits}</div>
                        ) : (
                            <SearchHitContainer
                                searchHits={hits.map((hit) => (
                                    <ClassificationSearchHit key={hit.id} classification={hit} />
                                ))}
                                    noSearchHits={false}
                                    onPageChange={onPageChange}
                                />
                        )
                    }
                    </>

            }
        />
        )
    }

export default ClassificationsServicePage;
