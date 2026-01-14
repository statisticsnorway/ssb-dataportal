'use client';

import { Spinner } from '@digdir/designsystemet-react';
import { useMemo, useState } from 'react';
import { SearchHitContainer } from '@/components/search-page-wrapper/search-hits-container';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { SortTypes, useSearchStateVardef } from '@/hooks/useSearchStateVardef';
import { CodeItem } from '@/libs/data-access/klass/models';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { localization } from '@/libs/language';
import { FilterGroup } from '@/types/filters';
import { SUBJECT_AREA } from '@/utils/constants';
import { VardefSearchHit } from '../components/vardefSearchHit';

interface VariableDefinitionsServicePageProps {
  rawHits: RenderedView[];
  isLoading?: boolean;
  subjectFields: CodeItem[];
}

const VariableDefinitionsServicePage = ({ rawHits, isLoading, subjectFields }: VariableDefinitionsServicePageProps) => {
  const [selectedVariableDefinitions, setSelectedVariableDefinitions] = useState<string[]>([]);

  const filterGroups: FilterGroup[] = useMemo(() => {
    const groups: FilterGroup[] = [
      {
        filterHeading: SUBJECT_AREA,
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

  const filteredHits = useMemo(() => {
    if (isLoading) return <Spinner aria-label='Laster variabeldefinisjoner' />;

    // If no filters selected, return all hits
    if (!selectedVariableDefinitions.length) return memoizedHits;

    return memoizedHits.filter((hit) =>
      hit.subjectFields.some((f) => f.code != null && selectedVariableDefinitions.includes(f.code)),
    );
  }, [memoizedHits, selectedVariableDefinitions, isLoading]);

  const { hits, sortKey, setSortKey, sortTypes } = useSearchStateVardef(filteredHits);

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
      totalHits={hits.length}
      searchResult={
        <>
          {isLoading ? (
            <div>Loading...</div>
          ) : hits.length === 0 ? (
            <div>{localization.search.noHits}</div>
          ) : (
            <SearchHitContainer
              searchHits={hits}
              renderHit={(hit) => <VardefSearchHit key={hit.id} variableDefinition={hit as RenderedView} />}
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
