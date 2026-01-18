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
import { FilterGroup, FilterItem } from '@/types/filters';
import { REMOVE_ALL_FILTERS, SUBJECT_AREA } from '@/utils/constants';
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

  const subjectFilters = useMemo(
    () => subjectFields.map((f) => ({ label: String(f.name), value: String(f.code) })),
    [subjectFields],
  );

  /**
   * Memoized array of filter groups used in the FiltersPanel.
   *
   * This array is memoized with `useMemo` and only recalculates when
   * `selectedVariableDefinitions` or `subjectFields` change.
   */
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

  /**
   * Memoized array of filtered hits based on selected variable definitions.
   *
   * If no variables are selected, returns the original `rawHits`.
   * Otherwise, filters `rawHits` to include only items whose `subject_fields`
   * contain at least one field with a `code` that matches a selected variable's value.
   *
   * Dependencies:
   * - `rawHits`: The full array of hits to filter.
   * - `selectedVariableDefinitions`: Array of selected filter items used to determine which hits to include.
   */
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
          filterGroups={filterGroups}
          onClearAll={{
            text: REMOVE_ALL_FILTERS,
            action: () => setSelectedVariableDefinitions([]),
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
