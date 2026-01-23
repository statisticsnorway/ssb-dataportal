'use client';

import { Spinner } from '@digdir/designsystemet-react';
import { useMemo, useState } from 'react';
import { FiltersPanel } from '@/components/filter/filters-panel';
import { SearchHitContainer } from '@/components/search-page-wrapper/search-hits-container';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { TagsGroup } from '@/components/tags-group';
import { SortTypes, useSearchStateVardef } from '@/hooks/useSearchStateVardef';
import { CodeItem } from '@/libs/data-access/klass/models';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { localization } from '@/libs/language';
import { FilterGroup, FilterItem } from '@/types/filters';
import { buildTagsLabel, countHits } from '@/utils/functions';
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
    return <Spinner aria-label={localization.loadingVariableDefinitions} />;
  }
  const [selectedVariableDefinitions, setSelectedVariableDefinitions] = useState<FilterItem[]>([]);

  const selectedItemsWithCounts = useMemo(() => {
    const hitCountsByCode = countHits(selectedVariableDefinitions, rawHits);

    return selectedVariableDefinitions.map((item) => ({
      ...item,
      count: hitCountsByCode[item.value] ?? 0,
    }));
  }, [rawHits, selectedVariableDefinitions]);

  const subjectFilters = useMemo(
    () => subjectFields.map((f) => ({ label: String(f.name), value: String(f.code) })),
    [subjectFields],
  );

  /**
   * Memoized array of filter groups used in the FiltersPanel.
   */
  const filterGroups: FilterGroup[] = useMemo(
    () => [
      {
        filterHeading: localization.subjectArea,
        filters: subjectFilters,
        selectedItems: selectedItemsWithCounts,
        onFilterChange: setSelectedVariableDefinitions,
      },
    ],
    [subjectFields, selectedItemsWithCounts],
  );

  /**
   * Memoized array of filtered hits based on selected variable definitions.
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
      searchLabel={localization.search.searchForVariableDefinitions}
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
          onClearAll={{
            text: localization.removeAlleFilters,
            action: () => setSelectedVariableDefinitions([]),
          }}
          tagData={
            new Map(
              filterGroups.flatMap((group) =>
                group.selectedItems.map((item) => [item.value, buildTagsLabel(item.label, item.count)]),
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
