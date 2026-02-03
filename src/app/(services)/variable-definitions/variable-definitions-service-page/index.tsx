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
import { SortTypes, sortTypes } from '@/types/sortTypes';
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
   * @return An array of RenderedView objects, memoized for performance.
   */
  const displayedVariables = useMemo(
    () => filterAndSortVariables(variables, textFilter, subjectFilters, sortOption),
    [variables, textFilter, subjectFilters, sortOption],
  );

  const toggleSubject = (filter: FilterItem) =>
    setSubjectFilters((prev) =>
      prev.some((item) => item.code === filter.code) ? prev.filter((c) => c.code !== filter.code) : [...prev, filter],
    );

  const clearAll = () => {
    setTextFilter('');
    setSubjectFilters([]);
  };

  const subjectFilterItems: FilterItem[] = subjectFields.map((item) => ({
    code: item.code ?? '',
    name: item.name ?? undefined,
  }));

  return (
    <SearchPage
      asideContent={
        <FiltersPanel>
          <TextFilter
            label='Navn' /* TODO - move to localization */
            searchTerm={textFilter}
            setSearchTerm={setTextFilter}
          />
          <CheckboxFilter
            filterHeading={localization.subjectArea} //TODO - move to localization
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
      controlsContent={<SortFields sortOptions={sortTypes} sortOption={sortOption} setSortOption={setSortOption} />}
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
