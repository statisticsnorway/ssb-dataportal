import React, { useMemo } from 'react';
import { VariableDefinitionType } from '@/types/variableDefinition';
import { FilterGroup } from '@/types/filters';
import { SearchHitsLayout } from '@/components/search-hits-layout';
import { FiltersPanel } from '@/components/filters-panel';
import SortFields from '@/components/sort-fields';
import { SortTypes, useSearchStateVardef } from '@/hooks/useSearchStateVardef';
import { SearchHitContainer } from '@/components/search-hits-container';
import { localization } from '@/utils/src';
import { VardefSearchHit } from './vardefSearchHit';

interface VariableDefinitionsServicePageProps {
    rawHits: VariableDefinitionType[];
    isLoading?: boolean;
    filterGroups: FilterGroup[];
}

const VariableDefinitionsServicePage = ({
    rawHits,
    isLoading,
    filterGroups,
}: VariableDefinitionsServicePageProps) => {

    const memoizedHits = useMemo(() => (isLoading ? [] : rawHits), [isLoading, rawHits]);

    const { hits, sortKey, setSortKey, sortTypes } = useSearchStateVardef(memoizedHits);

    console.log(
        'Filters: ',
        filterGroups.map((filterGroup) => filterGroup.selectedItems),
    );

    return (
        <SearchHitsLayout
            filterContent={
                <FiltersPanel filterGroups={filterGroups} />
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
                                    <VardefSearchHit key={hit.id} variableDefinition={hit} />
                                ))}
                                noSearchHits={false}
                            />
                        )
                    }
                </>
            }
        />
    );
};

export default VariableDefinitionsServicePage;