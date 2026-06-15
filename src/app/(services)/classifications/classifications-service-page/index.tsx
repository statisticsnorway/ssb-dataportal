'use client';

import { Spinner } from '@digdir/designsystemet-react';
import { parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { Suspense } from 'react';
import { FiltersPanel } from '@/components/filters';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { SortFields } from '@/components/sort-fields';
import { ClassificationResource } from '@/libs/data-access/klass';
import { CodeItem } from '@/libs/data-access/klass/models';
import { localization } from '@/libs/language';
import { FilterItem } from '@/types/filters';
import { SortTypes, sortTypes } from '@/types/sort';
import { tabsData } from '../../tabs';
import { ClassificationProvider } from './components/classificationContext';
import { FilterTagsSection } from './components/FilterTagsSection';
import { ResultsCount } from './components/ResultsCount';
import { ResultsSection } from './components/ResultsSection';
import { SubjectFiltersSection, SubjectFiltersSectionFallback } from './components/SubjectFiltersSection';

interface ClassificationServicePageProps {
  classificationsPromise: Promise<{ data: ClassificationResource[]; error: Error | null }>;
  subjectFieldsPromise: Promise<{ data: CodeItem[]; error: Error | null }>;
}

// Declare outside so not rerendered
const PAGE_SIZE = 20;

const ClassificationsServicePage = ({
  classificationsPromise,
  subjectFieldsPromise,
}: ClassificationServicePageProps) => {
  const [queryState, setQueryState] = useQueryStates({
    subjects: parseAsArrayOf(parseAsString).withDefault([]),
    sort: parseAsStringLiteral(sortTypes).withDefault('titleAsc'),
    page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
  });

  const { page, sort, subjects } = queryState;

  const handlePageChange = (nextPage: number) => {
    void setQueryState({ page: nextPage });
    const element: HTMLElement | null = document.getElementsByClassName('ds-card')[0] as HTMLElement | null;
    element?.focus({ preventScroll: true });
    element?.scrollIntoView({ behavior: 'instant', block: 'start' });
  };

  const toggleSubject = (filter: FilterItem) => {
    const nextSubjects = subjects.includes(filter.value)
      ? subjects.filter((value) => value !== filter.value)
      : [...subjects, filter.value];

    void setQueryState({
      subjects: nextSubjects.length > 0 ? nextSubjects : null,
      page: 1,
    });
  };

  const removeFilter = (filter: FilterItem) => {
    void setQueryState({
      subjects: subjects.filter((value) => value !== filter.value),
      page: 1,
    });
  };

  const clearAll = () => {
    void setQueryState({
      subjects: null,
      sort: null,
      page: null,
    });
  };

  return (
    <ClassificationProvider
      classificationsPromise={classificationsPromise}
      subjectFieldsPromise={subjectFieldsPromise}
      selectedSubjectCodes={subjects}
      sortOption={sort}
    >
      <SearchPage
        tabsId={tabsData.Classifications.id}
        header={localization.tabs.classifications}
        asideContent={
          <FiltersPanel>
            <Suspense fallback={<SubjectFiltersSectionFallback />}>
              <SubjectFiltersSection onFilterChange={toggleSubject} />
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
            <FilterTagsSection onClose={removeFilter} onClearAll={clearAll} />
          </Suspense>
        }
        controlsContent={
          <SortFields
            sortOptions={sortTypes}
            sortValue={sort}
            onSortChange={(value: SortTypes) =>
              void setQueryState({
                sort: value,
                page: 1,
              })
            }
          />
        }
        searchResult={
          <Suspense fallback={<Spinner aria-label={localization.loading.results} />}>
            <ResultsSection currentPage={page} pageSize={PAGE_SIZE} onPageChange={handlePageChange} />
          </Suspense>
        }
      />
    </ClassificationProvider>
  );
};

export default ClassificationsServicePage;
