'use client';

import { Spinner } from '@digdir/designsystemet-react';
import { useMemo, useState } from 'react';
import { FiltersPanel } from '@/components/filter/filters-panel';
import { SearchHitContainer } from '@/components/search-page-wrapper/search-hits-container';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { TagsGroup } from '@/components/tags-group';
import { useSearchStateVardef } from '@/hooks/useSearchStateVardef';
import { CodeItem } from '@/libs/data-access/klass/models';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { localization } from '@/libs/language';
import { FilterGroup, FilterItem } from '@/types/filters';
import { SortTypes } from '@/types/sort';
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
  const [selectedFilters, setSelectedFilters] = useState<FilterItem[]>([]);

  const selectedItemsWithCounts = useMemo(() => {
    const hitCountsByCode = countHits(selectedFilters, rawHits);

    return selectedFilters.map((item: FilterItem) => ({
      ...item,
      count: hitCountsByCode[item.value] ?? 0,
    }));
  }, [rawHits, selectedFilters]);

  const subjectFilters = useMemo(
    () => subjectFields.map((f) => ({ label: String(f.name), value: String(f.code) })),
    [subjectFields],
  );

  /**
   * Returns a memoized array of filter groups used in the FiltersPanel.
   *
   * @param subjectFilters - Array of filters for the subject area.
   * @param selectedItemsWithCounts - Currently selected filter items with their counts.
   * @param setSelectedFilters  - Callback to update selected filters.
   * @return An array of FilterGroup objects, memoized for performance.
   */
  const filterGroups: FilterGroup[] = useMemo(
    () => [
      {
        filterHeading: localization.subjectArea,
        filters: subjectFilters,
        selectedItems: selectedItemsWithCounts,
        onFilterChange: setSelectedFilters,
      },
    ],
    [subjectFields, selectedItemsWithCounts],
  );

  /**
   * Returns a memoized array of hits filtered by the selected filters.
   *
   * @param rawHits - The full array of hits to filter.
   * @param selectedFilters - Array of currently selected FilterItem objects.
   * @return An array of hits that match the selected filters; if none are selected, returns all hits.
   */
  const filteredHits = useMemo(() => {
    if (!selectedFilters.length) return rawHits;

    const selectedCodes = selectedFilters.map((s) => s.value);

    return rawHits.filter((hit) => hit.subject_fields?.some((f) => f.code != null && selectedCodes.includes(f.code)));
  }, [rawHits, selectedFilters]);

  const { hits, sortKey, setSortKey, sortTypes } = useSearchStateVardef(filteredHits);

  return (
    <SearchPage
      asideContent={filterGroups ? <FiltersPanel filterGroups={filterGroups} /> : null}
      searchLabel={localization.search.searchForVariableDefinitions}
      sortOptions={sortTypes}
      sortValue={sortKey}
      onSortChange={(key: SortTypes) => setSortKey(key)}
      totalHits={hits.length}
      infoContent={
        <TagsGroup
          maxTags={subjectFields.length}
          closeButton={true}
          onClose={(key) => {
            const newSelected = selectedFilters.filter((f) => f.value !== key);
            setSelectedFilters(newSelected);
          }}
          onClearAll={{
            text: localization.button.removeFilter,
            action: () => setSelectedFilters([]),
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
            <div>{errorMessage}</div>
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
