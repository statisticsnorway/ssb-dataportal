'use client';

import { useMemo, useState } from 'react';
import { FilterTags } from '@/components/filter-tags';
import { CheckboxFilter } from '@/components/filters/checkbox-filter';
import { FiltersPanel } from '@/components/filters/filters-panel';
import { TextFilter } from '@/components/filters/text-filter';
import { SearchHitContainer } from '@/components/search-page-wrapper/search-hits-container';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { SortFields } from '@/components/sort-fields';
import { SortTypes, sortTypes } from '@/hooks/useSearchStateVardef';
import { CodeItem } from '@/libs/data-access/klass/models';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { localization } from '@/libs/language';
import { FilterItem } from '@/types/filters';
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
  const [textFilters, setTextFilters] = useState<Record<string, string>>({});

  const displayedVariables = useMemo(
    () => filterAndSortVariables(variables, textFilters, subjectFilters, sortOption),
    [variables, textFilters, subjectFilters, sortOption],
  );

  const toggleSubject = (filter: FilterItem) =>
    setSubjectFilters((prev) =>
      prev.some((item) => item.code === filter.code) ? prev.filter((c) => c.code !== filter.code) : [...prev, filter],
    );

  const clearAll = () => {
    setTextFilters({});
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
            field='name' /*TODO - move to localization*/
            filters={textFilters}
            setFilters={setTextFilters}
          />
          <CheckboxFilter
            filterHeading={'Statisitikkområde'} //TODO - move to localization
            key={'Statisitikkområde'} //TODO - move to localization
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
          searchTerms={textFilters}
          onClose={toggleSubject}
          onClearAll={clearAll}
          onClearSearch={() => setTextFilters({})}
        />
      }
      controlsContent={<SortFields sortOptions={sortTypes} sortOption={sortOption} setSortOption={setSortOption} />}
      searchResult={
        <>
          {errorMessage ? (
            <div>Could not fetch data: {errorMessage}</div>
          ) : displayedVariables.length === 0 ? (
            <div>{localization.search.noHits}</div>
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
