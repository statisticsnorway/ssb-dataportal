'use client';

import { useMemo, useState } from 'react';
import { SearchHitContainer } from '@/components/search-page-wrapper/search-hits-container';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { SortTypes, useSearchStateVardef } from '@/hooks/useSearchStateVardef';
import { CodeItem } from '@/libs/data-access/klass/models';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { localization } from '@/libs/language';
import { FilterGroup } from '@/types/filters';
import { VardefSearchHit } from '../components/vardefSearchHit';

interface VariableDefinitionsServicePageProps {
  rawHits: RenderedView[];
  isLoading?: boolean;
  errorMessage: string | null;
  subjectFields: CodeItem[];
}

const VariableDefinitionsServicePage = ({
  rawHits,
  isLoading,
  errorMessage,
  subjectFields,
}: VariableDefinitionsServicePageProps) => {
  const [selectedVariableDefinitions, setSelectedVariableDefinitions] = useState<string[]>([]);
  console.log(`Hits: ${rawHits.length}, isLoading: ${isLoading}, errorMessage: ${errorMessage}`);

  const filterGroups: FilterGroup[] = useMemo(() => {
    const groups: FilterGroup[] = [
      {
        filterHeading: 'Statistikkområde',
        filters: subjectFields.map((f: CodeItem) => ({
          label: f.name,
          value: String(f.code),
        })),
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
      sortOptions={sortTypes}
      sortValue={sortKey}
      onSortChange={(key: string) => setSortKey(key as SortTypes)}
      searchResult={
        <>
          {errorMessage ? (
            <div>Could not fetch data: {errorMessage}</div>
          ) : hits.length === 0 ? (
            <div>{localization.search.noHits}</div>
          ) : (
            <SearchHitContainer
              searchHits={hits}
              renderHit={(hit) => <VardefSearchHit key={hit.id} variableDefinition={hit as RenderedView} />}
              totalHits={hits.length}
              noSearchHits={hits.length === 0}
              onPageChange={function (): void {
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
