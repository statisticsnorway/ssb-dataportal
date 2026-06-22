'use client';

import { Alert, Heading, Paragraph, Spinner } from '@digdir/designsystemet-react';
import { parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { Suspense, use, useMemo } from 'react';
import { useAuthContext } from '@/app/authContext';
import { FilterTagsSection } from '@/components/filters/filter-tags-section';
import { FiltersPanel } from '@/components/filters/filters-panel';
import { TextFilter } from '@/components/filters/text-filter';
import { ExternalLink } from '@/components/link-components/externalLink';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { SortFields } from '@/components/sort-fields';
import { CodeItem } from '@/libs/data-access/klass/models';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { localization } from '@/libs/language/src/localization';
import { FilterItem } from '@/types/filters';
import { sortTypes } from '@/types/sort';
import { scrollToFilterTags } from '@/utils/scrollToFilterTags';
import { tabsData } from '../../tabs';
import { ResultsCount } from './components/ResultsCount';
import { ResultsSection } from './components/ResultsSection';
import { StatusFiltersSection } from './components/StatusFiltersSection';
import { SubjectFiltersSection } from './components/SubjectFiltersSection';
import { VariableDefinitionsProvider } from './components/variableDefinitionContext';

const statusLabelByValue: Record<string, string> = {
  DRAFT: localization.status.draft,
  PUBLISHED_INTERNAL: localization.status.publishedInternal,
  PUBLISHED_EXTERNAL: localization.status.publishedExternal,
};

interface VariableDefinitionsServicePageProps {
  variablesPromise: Promise<{ data: RenderedView[]; error: Error | null }>;
  subjectFieldsPromise: Promise<{ data: CodeItem[]; error: Error | null }>;
}

const VariableDefinitionsServicePage = ({
  variablesPromise,
  subjectFieldsPromise,
}: VariableDefinitionsServicePageProps) => {
  const pageSize = 8;
  const { isAuthenticated } = useAuthContext();
  const [queryState, setQueryState] = useQueryStates({
    q: parseAsString.withDefault(''),
    status: parseAsArrayOf(parseAsString).withDefault([]),
    subjects: parseAsArrayOf(parseAsString).withDefault([]),
    sort: parseAsStringLiteral(sortTypes).withDefault('titleAsc'),
    page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
  });

  const { q, status, subjects, sort, page } = queryState;

  const { data: subjectFields } = use(subjectFieldsPromise);

  const statusFilters = useMemo<FilterItem[]>(
    () =>
      status.map((value) => ({
        value,
        label: statusLabelByValue[value] ?? value,
      })),
    [status],
  );

  const subjectFilters = useMemo<FilterItem[]>(
    () =>
      subjects.map((value) => {
        const subject = subjectFields.find((item) => String(item.code) === value);
        return {
          value,
          label: subject ? String(subject.name) : value,
        };
      }),
    [subjects, subjectFields],
  );

  const filterTags = useMemo(() => [...statusFilters, ...subjectFilters], [statusFilters, subjectFilters]);

  const toggleStatus = (filter: FilterItem) => {
    const nextStatus = status.includes(filter.value)
      ? status.filter((value) => value !== filter.value)
      : [...status, filter.value];
    void setQueryState({ status: nextStatus, page: 1 });
    scrollToFilterTags();
  };

  const toggleSubject = (filter: FilterItem) => {
    const nextSubjects = subjects.includes(filter.value)
      ? subjects.filter((value) => value !== filter.value)
      : [...subjects, filter.value];
    void setQueryState({ subjects: nextSubjects, page: 1 });
    scrollToFilterTags();
  };

  const clearAll = () => {
    void setQueryState({
      q: null,
      status: null,
      subjects: null,
      sort: null,
      page: null,
    });
    scrollToFilterTags();
  };

  const handlePageChange = (nextPage: number) => {
    void setQueryState({ page: nextPage });
    scrollToFilterTags();
  };

  const removeFilter = (filter: FilterItem) => {
    void setQueryState({
      status: status.filter((value) => value !== filter.value),
      subjects: subjects.filter((value) => value !== filter.value),
      page: 1,
    });
    scrollToFilterTags();
  };

  const pageInfo = (
    <Alert data-color='info' style={{ marginBottom: '1rem' }}>
      <Heading className='infoHeadingSecondary' level={2} data-size='sm' style={{ marginBottom: 'var(--ds-size-2)' }}>
        {localization.migration.header}
      </Heading>
      <Paragraph>{localization.migration.info}</Paragraph>
      <ExternalLink
        href='https://www.ssb.no/a/metadata/definisjoner/variabler/main.html'
        linkText={`${' '}${localization.migration.linkText}`}
      />
    </Alert>
  );

  return (
    <VariableDefinitionsProvider
      variablesPromise={variablesPromise}
      textFilter={q}
      subjectFilters={subjectFilters}
      statusFilters={statusFilters}
      sortOption={sort}
      subjectFields={subjectFields}
    >
      <SearchPage
        banner={pageInfo}
        tabsId={tabsData.VariableDefinitions.id}
        header={localization.tabs.variableDefinitions}
        asideContent={
          <FiltersPanel heading={localization.search.filter.label}>
            <TextFilter
              label={localization.search.textFilter.label}
              searchTerm={q}
              setSearchTerm={(value) => {
                void setQueryState({
                  q: value || null,
                  page: 1,
                });
                scrollToFilterTags();
              }}
            />
            {isAuthenticated ? (
              <Suspense fallback={<Spinner aria-label={localization.loading.filters} />}>
                <StatusFiltersSection
                  variablesPromise={variablesPromise}
                  selectedItems={statusFilters}
                  onFilterChange={toggleStatus}
                />
              </Suspense>
            ) : null}
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
            <FilterTagsSection
              tags={filterTags}
              onRemoveTag={removeFilter}
              onClearAll={clearAll}
              searchTerm={q}
              onClearSearch={() => {
                void setQueryState({
                  q: null,
                  page: 1,
                });
                scrollToFilterTags();
              }}
            />
          </Suspense>
        }
        controlsContent={
          <SortFields
            sortOptions={sortTypes}
            sortValue={sort}
            onSortChange={(value) => {
              void setQueryState({
                sort: value,
                page: 1,
              });
              scrollToFilterTags();
            }}
          />
        }
        searchResult={
          <Suspense fallback={<Spinner aria-label={localization.loading.results} />}>
            <ResultsSection currentPage={page} pageSize={pageSize} handlePageChange={handlePageChange} />
          </Suspense>
        }
      />
    </VariableDefinitionsProvider>
  );
};

export default VariableDefinitionsServicePage;
