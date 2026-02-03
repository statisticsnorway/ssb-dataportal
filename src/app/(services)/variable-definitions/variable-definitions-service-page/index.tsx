'use client';

import { useMemo, useState } from 'react';
import { FilterTags } from '@/components/filter-tags';
import { CheckboxFilter } from '@/components/filters/checkbox-filter';
import { FiltersPanel } from '@/components/filters/filters-panel';
import { TextFilter } from '@/components/filters/text-filter';
import { SearchHitContainer } from '@/components/search-page-wrapper/search-hits-container';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { SortFields } from '@/components/sort-fields';
import { CodeItem } from '@/libs/data-access/klass/models';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { localization } from '@/libs/language/src/localization';
import { FilterItem } from '@/types/filters';
import { SortTypes, sortTypes } from '@/types/sort';
import { filterAndSortVariables } from '@/utils/filterAndSort';
import { VardefSearchHit } from '../components/vardefSearchHit';

interface VariableDefinitionsServicePageProps {
  variables: RenderedView[];
  errorMessage: string | null;
  subjectFields: CodeItem[];
}

const VariableDefinitionsServicePage = ({
  variables,
  errorMessage,
  subjectFields,
}: VariableDefinitionsServicePageProps) => {
  const [sortOption, setSortOption] = useState<SortTypes>('titleAsc');
  const [subjectFilters, setSubjectFilters] = useState<FilterItem[]>([]);
  const [textFilter, setTextFilter] = useState<string>('');

  /**
   * Returns a memoized array of the variable definitions to display after applying text and subject filters, as well as sorting.
   *
   * @param variables     - The full list of variable definitions.
   * @param subjectFilters - Currently selected subject filters.
   * @param textFilter     - Current text filter input.
   * @param sortOption     - Currently selected sort option.
   * @return An array of sorted RenderedView objects, memoized for performance.
   */
  const displayedVariables = useMemo(
    () => filterAndSortVariables(variables, textFilter, subjectFilters, sortOption),
    [variables, textFilter, subjectFilters, sortOption],
  );

  const toggleSubject = (filter: FilterItem) =>
    setSubjectFilters((prev) =>
      prev.some((item) => item.value === filter.value)
        ? prev.filter((c) => c.value !== filter.value)
        : [...prev, filter],
    );

  const clearAll = () => {
    setTextFilter('');
    setSubjectFilters([]);
  };

  const subjectFilterItems = useMemo(
    () => subjectFields.map((f) => ({ label: String(f.name), value: String(f.code) })),
    [subjectFields],
  );

  return (
    <SearchPage
      asideContent={
        <FiltersPanel>
          <TextFilter
            label={localization.search.textFilter.label}
            searchTerm={textFilter}
            setSearchTerm={setTextFilter}
          />
          <CheckboxFilter
            filterHeading={localization.subjectArea}
            filters={subjectFilterItems}
            selectedItems={subjectFilters}
            onFilterChange={toggleSubject}
          />
        </FiltersPanel>
      }
      totalHits={displayedVariables.length}
      infoContent={
        <FilterTags
          activeFilters={subjectFilters}
          searchTerm={textFilter}
          onClose={toggleSubject}
          onClearAll={clearAll}
          onClearSearch={() => setTextFilter('')}
        />
      }
      controlsContent={<SortFields sortOptions={sortTypes} sortValue={sortOption} onSortChange={setSortOption} />}
      searchResult={
        <>
          {errorMessage ? (
            <div>{errorMessage}</div>
          ) : (
            <SearchHitContainer
              searchHits={displayedVariables}
              renderHit={(hit) => <VardefSearchHit key={hit.id} variableDefinition={hit as RenderedView} />}
              noSearchHits={displayedVariables.length === 0}
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
