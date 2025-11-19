import React, { useMemo } from 'react';
import { FiltersPanel } from '@/components/filters-panel';
import { SearchHitContainer } from '@/components/search-hits-container';
import { SearchHitsLayout } from '@/components/search-hits-layout';
import SortFields from '@/components/sort-fields';
import { SortTypes, useSearchStateVardef } from '@/hooks/useSearchStateVardef';
import { FilterGroup } from '@/types/filters';
import { VariableDefinitionType } from '@/types/variableDefinition';
import { localization } from '@/utils/src';
import { VardefSearchHit } from './vardefSearchHit';

interface VariableDefinitionsServicePageProps {
  rawHits: VariableDefinitionType[];
  isLoading?: boolean;
  filterGroups: FilterGroup[];
}

const VariableDefinitionsServicePage = ({ rawHits, isLoading, filterGroups }: VariableDefinitionsServicePageProps) => {
  const memoizedHits = useMemo(() => (isLoading ? [] : rawHits), [isLoading, rawHits]);

  const { hits, sortKey, setSortKey, sortTypes } = useSearchStateVardef(memoizedHits);

  console.log(
    'Filters: ',
    filterGroups.map((filterGroup) => filterGroup.selectedItems),
  );

  return (
    <SearchHitsLayout
      filterContent={<FiltersPanel filterGroups={filterGroups} />}
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
              searchHits={hits.map((hit) => <VardefSearchHit key={hit.id} variableDefinition={hit} />)}
              noSearchHits={false}
              paginationInfo={{
                currentPage: 0,
                totalPages: 0,
              }}
              onPageChange={function (page: number): void {
                throw new Error('Function not implemented.');
              }}
            />
          )}
        </>
      }
    />
  );
};

export default VariableDefinitionsServicePage;
