'use client';

import { Spinner } from '@digdir/designsystemet-react';
import { parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { Suspense, use, useMemo } from 'react';
import { FiltersPanel } from '@/components/filters';
import { FilterTagsSection } from '@/components/filters/filter-tags-section';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { SortFields } from '@/components/sort-fields';

import { ClassificationResource } from '@/libs/data-access/klass';
import { CodeItem } from '@/libs/data-access/klass/models';
import { localization } from '@/libs/language';
import { clientLogger } from '@/libs/logger/client-logger';
import { FilterItem } from '@/types/filters';
import { SortTypes, sortTypes } from '@/types/sort';
import { tabsData } from '../../tabs';
import { ClassificationTypeFiltersSection } from './components/ClassificationTypeFiltersSection';
import { ClassificationProvider } from './components/classificationContext';
import { ResultsCount } from './components/ResultsCount';
import { ResultsSection } from './components/ResultsSection';
import { SubjectFiltersSection, SubjectFiltersSectionFallback } from './components/SubjectFiltersSection';

interface ClassificationServicePageProps {
  classificationsPromise: Promise<{ data: ClassificationResource[]; error: Error | null }>;
  subjectFieldsPromise: Promise<{ data: CodeItem[]; error: Error | null }>;
}

const PAGE_SIZE = 20;

const ClassificationsServicePage = ({
  classificationsPromise,
  subjectFieldsPromise,
}: ClassificationServicePageProps) => {
  const [queryState, setQueryState] = useQueryStates({
    subjects: parseAsArrayOf(parseAsString).withDefault([]),
    types: parseAsArrayOf(parseAsString).withDefault([]),
    sort: parseAsStringLiteral(sortTypes).withDefault('titleAsc'),
    page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
  });

  const { page, sort, subjects, types } = queryState;

  const { data: subjectFields } = use(subjectFieldsPromise);

  const filterTags = useMemo<FilterItem[]>(
    () => [
      ...subjects.map((code) => {
        const subject = subjectFields?.find((item) => String(item.code) === code);
        return { value: code, label: subject ? String(subject.name) : code };
      }),
      ...types.map((code) => ({ value: code, label: code })),
    ],
    [subjects, subjectFields, types],
  );

  const updateQuery = (update: Parameters<typeof setQueryState>[0]) =>
    setQueryState(update).catch((error) => {
      clientLogger.error('Failed to update query state', error);
    });

  const handlePageChange = (nextPage: number) => {
    updateQuery({ page: nextPage });
    const element = document.querySelector<HTMLElement>('.ds-card');
    element?.focus({ preventScroll: true });
    element?.scrollIntoView({ behavior: 'instant', block: 'start' });
  };

  const toggleSubject = (filter: FilterItem) => {
    const nextSubjects = subjects.includes(filter.value)
      ? subjects.filter((v) => v !== filter.value)
      : [...subjects, filter.value];

    updateQuery({ subjects: nextSubjects.length > 0 ? nextSubjects : null, page: 1 });
  };

  const toggleClassificationType = (filter: FilterItem) => {
    const nextTypes = types.includes(filter.value) ? types.filter((v) => v !== filter.value) : [...types, filter.value];

    updateQuery({ types: nextTypes.length > 0 ? nextTypes : null, page: 1 });
  };

  const removeFilter = (filter: FilterItem) => {
    updateQuery({
      types: types.filter((v) => v !== filter.value),
      subjects: subjects.filter((v) => v !== filter.value),
      page: 1,
    });
  };

  const clearAll = () => updateQuery({ subjects: null, types: null, sort: null, page: null });

  return (
    <ClassificationProvider
      classificationsPromise={classificationsPromise}
      subjectFieldsPromise={subjectFieldsPromise}
      selectedSubjectCodes={subjects}
      selectedClassificationTypes={types}
      sortOption={sort}
    >
      <SearchPage
        tabsId={tabsData.Classifications.id}
        header={localization.tabs.classifications}
        asideContent={
          <FiltersPanel>
            <Suspense fallback={null}>
              <ClassificationTypeFiltersSection onFilterChange={toggleClassificationType} />
            </Suspense>
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
            <FilterTagsSection tags={filterTags} onRemoveTag={removeFilter} onClearAll={clearAll} />
          </Suspense>
        }
        controlsContent={
          <SortFields
            sortOptions={sortTypes}
            sortValue={sort}
            onSortChange={(value: SortTypes) => updateQuery({ sort: value, page: 1 })}
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
