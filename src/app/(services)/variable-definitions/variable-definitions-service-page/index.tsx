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
import { tabsData } from '../../tabs';
import { FilterTagsSection } from './components/FilterTagsSection';
import { ResultsCount } from './components/ResultsCount';
import { ResultsSection } from './components/ResultsSection';
import { StatusFiltersSection } from './components/StatusFiltersSection';
import { SubjectFiltersSection } from './components/SubjectFiltersSection';
import { VariableDefinitionsProvider } from './components/variableDefinitionContext';

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
  const [statusFilters, setStatusFilters] = useState<FilterItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  useMemo(() => {
    setCurrentPage(1);
  }, [textFilter, subjectFilters, statusFilters, sortOption]);

  const toggleStatus = (filter: FilterItem) =>
    setStatusFilters((prev) =>
      prev.some((item) => item.value === filter.value)
        ? prev.filter((c) => c.value !== filter.value)
        : [...prev, filter],
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
    setStatusFilters([]);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const removeFilter = (filter: FilterItem) => {
    setStatusFilters((prev) => prev.filter((f) => f.value !== filter.value));
    setSubjectFilters((prev) => prev.filter((f) => f.value !== filter.value));
  };

  return (
    <VariableDefinitionsProvider
      variablesPromise={variablesPromise}
      textFilter={textFilter}
      subjectFilters={subjectFilters}
      statusFilters={statusFilters}
      sortOption={sortOption}
    >
      <SearchPage
        tabsId={tabsData.VariableDefinitions.id}
        header={localization.tabs.variableDefinitions}
        asideContent={
          <FiltersPanel>
            <TextFilter
              label={localization.search.textFilter.label}
              searchTerm={textFilter}
              setSearchTerm={setTextFilter}
            />
            <Suspense fallback={<Spinner aria-label={localization.loading.filters} />}>
              <StatusFiltersSection
                variablesPromise={variablesPromise}
                selectedItems={statusFilters}
                onFilterChange={toggleStatus}
              />
            </Suspense>
            <Suspense fallback={<Spinner aria-label={localization.loading.filters} />}>
              <SubjectFiltersSection
                variablesPromise={variablesPromise}
                subjectFieldsPromise={subjectFieldsPromise}
                selectedItems={subjectFilters}
                onFilterChange={toggleSubject}
              />
            </Suspense>
          </FiltersPanel>
        }
        totalHits={
          <Suspense fallback={null}>
            <ResultsCount />
          </Suspense>
        }
        infoContent={
          <Suspense fallback={null}>
            <FilterTagsSection onClose={removeFilter} onClearAll={clearAll} onClearSearch={() => setTextFilter('')} />
          </Suspense>
        }
        controlsContent={<SortFields sortOptions={sortTypes} sortValue={sortOption} onSortChange={setSortOption} />}
        searchResult={
          <Suspense fallback={<Spinner aria-label={localization.loading.results} />}>
            <ResultsSection currentPage={currentPage} pageSize={pageSize} handlePageChange={handlePageChange} />
          </Suspense>
        }
      />
    </VariableDefinitionsProvider>
  );
};

export default VariableDefinitionsServicePage;
