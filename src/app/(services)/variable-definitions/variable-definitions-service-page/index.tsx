'use client';

import { Spinner } from '@digdir/designsystemet-react';
import { Suspense, useMemo, useState } from 'react';
import { FiltersPanel } from '@/components/filters/filters-panel';
import { TextFilter } from '@/components/filters/text-filter';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { SortFields } from '@/components/sort-fields';
import { CodeItem } from '@/libs/data-access/klass/models';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { localization } from '@/libs/language/src/localization';
import { FilterItem } from '@/types/filters';
import { SortTypes, sortTypes } from '@/types/sort';
import { FiltersSection } from './components/FiltersSection';
import { FilterTagsSection } from './components/FilterTagsSection';
import { ResultsCount } from './components/ResultsCount';
import { ResultsSection } from './components/ResultsSection';

interface VariableDefinitionsServicePageProps {
  variablesPromise: Promise<{ data: RenderedView[]; error: Error | null }>;
  subjectFieldsPromise: Promise<{ data: CodeItem[]; error: Error | null }>;
}

const VariableDefinitionsServicePage = ({
  variablesPromise,
  subjectFieldsPromise,
}: VariableDefinitionsServicePageProps) => {
  const [sortOption, setSortOption] = useState<SortTypes>('titleAsc');
  const [subjectFilters, setSubjectFilters] = useState<FilterItem[]>([]);
  const [textFilter, setTextFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 20;

  useMemo(() => {
    setCurrentPage(1);
  }, [textFilter, subjectFilters, sortOption]);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <SearchPage
      header={localization.tabs.variableDefinitions}
      asideContent={
        <FiltersPanel>
          <TextFilter
            label={localization.search.textFilter.label}
            searchTerm={textFilter}
            setSearchTerm={setTextFilter}
          />
          <Suspense fallback={<Spinner aria-label={localization.loading.filters} />}>
            <FiltersSection
              subjectFieldsPromise={subjectFieldsPromise}
              selectedItems={subjectFilters}
              onFilterChange={toggleSubject}
            />
          </Suspense>
        </FiltersPanel>
      }
      totalHits={
        <Suspense fallback={null}>
          <ResultsCount
            variablesPromise={variablesPromise}
            textFilter={textFilter}
            subjectFilters={subjectFilters}
            sortOption={sortOption}
          />
        </Suspense>
      }
      infoContent={
        <Suspense fallback={null}>
          <FilterTagsSection
            variablesPromise={variablesPromise}
            subjectFilters={subjectFilters}
            textFilter={textFilter}
            sortOption={sortOption}
            onClose={toggleSubject}
            onClearAll={clearAll}
            onClearSearch={() => setTextFilter('')}
          />
        </Suspense>
      }
      controlsContent={<SortFields sortOptions={sortTypes} sortValue={sortOption} onSortChange={setSortOption} />}
      searchResult={
        <Suspense fallback={<Spinner aria-label={localization.loading.results} />}>
          <ResultsSection
            variablesPromise={variablesPromise}
            textFilter={textFilter}
            subjectFilters={subjectFilters}
            sortOption={sortOption}
            currentPage={currentPage}
            pageSize={pageSize}
            handlePageChange={handlePageChange}
          />
        </Suspense>
      }
    />
  );
};

export default VariableDefinitionsServicePage;
