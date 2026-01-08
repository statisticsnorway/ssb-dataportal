'use client';

import { useMemo, useState } from 'react';
import { SearchHitContainer } from '@/components/search-hits-container';
import SearchPage from '@/components/search-page/searchPage';
import { SortTypes, useSearchStateVardef } from '@/hooks/useSearchStateVardef';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { localization } from '@/libs/language';
import { FilterGroup } from '@/types/filters';
import { VardefSearchHit } from '../components/vardefSearchHit';
import styles from './vardef-service-page.module.css';

interface VariableDefinitionsServicePageProps {
  rawHits: RenderedView[];
  isLoading?: boolean;
}

const VariableDefinitionsServicePage = ({ rawHits, isLoading }: VariableDefinitionsServicePageProps) => {
  const [selectedVariableDefinitions, setSelectedVariableDefinitions] = useState<string[]>([]);

  const filterGroups: FilterGroup[] = useMemo(() => {
    const groups: FilterGroup[] = [
      {
        filterHeading: 'Status',
        filters: [
          { label: 'Utkast', value: 'draft' },
          { label: 'Publisert internt', value: 'published-internal' },
          { label: 'Publisert eksternt', value: 'published-external' },
        ],
        selectedItems: selectedVariableDefinitions,
        onFilterChange: setSelectedVariableDefinitions,
      },
    ];
    return groups;
  }, [selectedVariableDefinitions]);
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
      infoContent={<div className={styles.infoTest}>Text</div>}
      sortOptions={sortTypes}
      sortValue={sortKey}
      onSortChange={(key: string) => setSortKey(key as SortTypes)}
      searchResult={
        <>
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
