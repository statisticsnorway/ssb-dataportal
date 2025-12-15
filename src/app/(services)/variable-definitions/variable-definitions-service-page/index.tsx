import { useMemo } from 'react';
import { SearchHitContainer } from '@/components/search-hits-container';
import SearchPage from '@/components/search-page/searchPage';
import SortFields from '@/components/sort-fields';
import { SortTypes, useSearchStateVardef } from '@/hooks/useSearchStateVardef';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { localization } from '@/libs/language';
import { FilterGroup } from '@/types/filters';
import { VardefSearchHit } from '../components/vardefSearchHit';

interface VariableDefinitionsServicePageProps {
  rawHits: RenderedView[];
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
    <SearchPage
      filterGroups={filterGroups}
      searchLabel='Søk i variabeldefinisjoner'
      searchResult={
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
