'use client';

import { Spinner } from '@digdir/designsystemet-react';
import { useMemo, useState } from 'react';
import { FiltersPanel } from '@/components/filter/filters-panel';
import { SearchHitContainer } from '@/components/search-page-wrapper/search-hits-container';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { SortTypes, useSearchStateVardef } from '@/hooks/useSearchStateVardef';
import { CodeItem } from '@/libs/data-access/klass/models';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { localization } from '@/libs/language';
import { FilterGroup } from '@/types/filters';
import { SUBJECT_AREA } from '@/utils/constants';
import { TagsGroup } from '../../../../components/tags-group';
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
  if (isLoading) {
    return <Spinner aria-label='Laster variabeldefinisjoner' />;
  }
  const [selectedVariableDefinitions, setSelectedVariableDefinitions] = useState<FilterItem[]>([]);
  console.log(`Hits: ${rawHits.length}, isLoading: ${isLoading}, errorMessage: ${errorMessage}`);

  const subjectFilters = useMemo(
    () => subjectFields.map((f) => ({ label: String(f.name), value: String(f.code) })),
    [subjectFields],
  );

  const filterGroups: FilterGroup[] = useMemo(
    () => [
      {
        filterHeading: SUBJECT_AREA,
        filters: subjectFilters,
        selectedItems: selectedVariableDefinitions,
        onFilterChange: setSelectedVariableDefinitions,
      },
    ],
    [selectedVariableDefinitions, subjectFields],
  );

  const filteredHits = useMemo(() => {
    if (!selectedVariableDefinitions.length) return rawHits;

    const selectedCodes = selectedVariableDefinitions.map((s) => s.value);

    return rawHits.filter((hit) => hit.subject_fields?.some((f) => f.code != null && selectedCodes.includes(f.code)));
  }, [rawHits, selectedVariableDefinitions]);

  const { hits, sortKey, setSortKey, sortTypes } = useSearchStateVardef(filteredHits);

  return (
    <SearchPage
      asideContent={filterGroups ? <FiltersPanel filterGroups={filterGroups} /> : null}
      searchLabel='Søk i variabeldefinisjoner'
      sortOptions={sortTypes}
      sortValue={sortKey}
      onSortChange={(key: string) => setSortKey(key as SortTypes)}
      totalHits={hits.length}
      infoContent={
        <TagsGroup
          maxTags={subjectFields.length}
          closeButton={true}
          onClose={(key) => {
            const newSelected = selectedVariableDefinitions.filter((f) => f.value !== key);
            setSelectedVariableDefinitions(newSelected);
          }}
          tagData={
            new Map(
              filterGroups.flatMap((filterGroup) =>
                filterGroup.selectedItems.map((field) => [field.value, field.label] as [string, string]),
              ),
            )
          }
        />
      }
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
