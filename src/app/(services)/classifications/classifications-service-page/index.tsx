'use client';

import { Spinner } from '@digdir/designsystemet-react';
import { parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { Suspense, use, useEffect, useMemo, useState } from 'react';
import { FiltersPanel } from '@/components/filters';
import { FilterTagsSection } from '@/components/filters/filter-tags-section';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { SortFields } from '@/components/sort-fields';
import { ClassificationResource } from '@/libs/data-access/klass';
import { SearchResultResource } from '@/libs/data-access/klass/models';
import { localization } from '@/libs/language';
import { clientLogger } from '@/libs/logger/client-logger';
import { ClassificationType, isKnownClassificationType } from '@/types/classification';
import { FilterItem } from '@/types/filters';
import { KlassCode } from '@/types/klass-codes';
import { SortTypes, sortTypes } from '@/types/sort';
import {
  getClassificationTypeForLabel,
  getLabelForClassificationType,
} from '@/utils/classifications/classificationHelpers';
import { scrollToFilterTags } from '@/utils/scrollToFilterTags';
import { tabsData } from '../../tabs';
import { ClassificationTypeFiltersSection } from './components/ClassificationTypeFiltersSection';
import { ClassificationProvider } from './components/classificationContext';
import { KlassSearchSection } from './components/KlassSearchSection';
import { ResultsCount } from './components/ResultsCount';
import { ResultsSection } from './components/ResultsSection';
import { SubjectFiltersSection, SubjectFiltersSectionFallback } from './components/SubjectFiltersSection';

interface ClassificationServicePageProps {
  classificationsPromise: Promise<{ data: ClassificationResource[]; error: Error | null }>;
  subjectFieldsPromise: Promise<{ data: KlassCode[]; error: Error | null }>;
  searchResultPromise: Promise<{ data: SearchResultResource[]; error: Error | null }>;
  isSearchActive: boolean;
}

const toggleValue = (values: string[], nextValue: string): string[] => {
  return values.includes(nextValue) ? values.filter((value) => value !== nextValue) : [...values, nextValue];
};

const isDifferentFilterValue = (currentValue: string) => {
  return (filterValue: string) => filterValue !== currentValue;
};

const ClassificationsServicePage = ({
  classificationsPromise,
  subjectFieldsPromise,
  searchResultPromise,
  isSearchActive,
}: ClassificationServicePageProps) => {
  const pageSize = 8;
  const [queryState, setQueryState] = useQueryStates(
    {
      q: parseAsString.withDefault(''),
      subjects: parseAsArrayOf(parseAsString).withDefault([]),
      types: parseAsArrayOf(parseAsString).withDefault([]).withOptions({ shallow: true }),
      sort: parseAsStringLiteral(sortTypes).withDefault('titleAsc'),
      page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
    },
    { shallow: false },
  );

  const { q, page, sort, subjects, types } = queryState;
  const [hasInitializedTypes, setHasInitializedTypes] = useState(false);
  const selectedClassificationTypes = useMemo(() => {
    const normalizedTypes = types.map(getClassificationTypeForLabel).filter(isKnownClassificationType);
    if (!hasInitializedTypes && normalizedTypes.length === 0) {
      return [ClassificationType.Classification];
    }
    return normalizedTypes;
  }, [hasInitializedTypes, types]);

  const { data: subjectFields } = use(subjectFieldsPromise);

  const filterTags = useMemo<FilterItem[]>(
    () => [
      ...(q.trim() ? [{ value: q, label: `"${q}"` }] : []),
      ...subjects.map((code) => {
        const subject = subjectFields?.find((item) => String(item.code) === code);
        return { value: code, label: subject ? String(subject.name) : code };
      }),
      ...selectedClassificationTypes.map((code) => ({
        value: code,
        label: getLabelForClassificationType(code),
      })),
    ],
    [q, selectedClassificationTypes, subjects, subjectFields],
  );

  const updateQuery = (update: Parameters<typeof setQueryState>[0]) =>
    setQueryState(update).catch((error) => {
      clientLogger.error('Failed to update query state', error);
    });

  useEffect(() => {
    if (hasInitializedTypes) return;

    if (types.length > 0) {
      setHasInitializedTypes(true);
      return;
    }

    updateQuery({ types: [ClassificationType.Classification] });
    setHasInitializedTypes(true);
  }, [hasInitializedTypes, types]);

  const handlePageChange = (nextPage: number) => {
    updateQuery({ page: nextPage });
    scrollToFilterTags();
  };

  const toggleSubject = (filter: FilterItem) => {
    const nextSubjects = toggleValue(subjects, filter.value);

    updateQuery({ subjects: nextSubjects.length > 0 ? nextSubjects : null, page: 1 });
    scrollToFilterTags();
  };

  const toggleClassificationType = (filter: FilterItem) => {
    const nextTypes = toggleValue(selectedClassificationTypes, getClassificationTypeForLabel(filter.value));

    updateQuery({ types: nextTypes.length > 0 ? nextTypes : null, page: 1 });
    scrollToFilterTags();
  };

  const removeFilter = (filter: FilterItem) => {
    const isDifferent = isDifferentFilterValue(filter.value);
    const nextQ = q === filter.value ? null : q;

    updateQuery({
      q: nextQ,
      types: selectedClassificationTypes.filter(isDifferent),
      subjects: subjects.filter(isDifferent),
      page: 1,
    });
    scrollToFilterTags();
  };

  const clearAll = () => {
    updateQuery({ q: null, subjects: null, types: null, sort: null, page: null });
    scrollToFilterTags();
  };

  return (
    <ClassificationProvider
      classificationsPromise={classificationsPromise}
      subjectFieldsPromise={subjectFieldsPromise}
      searchResultPromise={searchResultPromise}
      selectedSubjectCodes={subjects}
      selectedClassificationTypes={selectedClassificationTypes}
      sortOption={sort}
      searchQuery={q}
      isSearchActive={isSearchActive}
    >
      <SearchPage
        tabsId={tabsData.Classifications.id}
        header={localization.tabs.classifications}
        asideContent={
          <FiltersPanel heading={localization.search.filter.filterAndSearch}>
            <Suspense fallback={null}>
              <KlassSearchSection
                query={q}
                onQueryChange={(value) => {
                  updateQuery({ q: value, page: 1 });
                  scrollToFilterTags();
                }}
              />
            </Suspense>
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
            onSortChange={(value: SortTypes) => {
              updateQuery({ sort: value, page: 1 });
              scrollToFilterTags();
            }}
          />
        }
        searchResult={
          <Suspense fallback={<Spinner aria-label={localization.loading.results} />}>
            <ResultsSection currentPage={page} pageSize={pageSize} onPageChange={handlePageChange} />
          </Suspense>
        }
      />
    </ClassificationProvider>
  );
};

export default ClassificationsServicePage;
