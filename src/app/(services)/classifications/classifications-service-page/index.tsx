'use client';

import { Alert, Spinner } from '@digdir/designsystemet-react';
import { useEffect, useMemo, useState } from 'react';
import { CheckboxFilter, FiltersPanel } from '@/components/filters';
import { SearchHitContainer } from '@/components/search-page-wrapper/search-hits-container';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { useSearchStateKlass } from '@/hooks/useSearchStateKlass';
import { getClassificationFamily } from '@/libs/data/classifications/classificationFamilyData';
import { ClassificationFamilyResource, ClassificationResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import { ClassificationType } from '@/types/classification';
import { FilterItem } from '@/types/filters';
import { SortTypes } from '@/types/sort';
import { ClassificationSearchHit } from './classificationSearchHit';

interface ClassificationServicePageProps {
  rawClassifications: ClassificationResource[];
  rawClassificationFamilies: ClassificationFamilyResource[];
}

// Declare outside so not rerendered
const PAGE_SIZE = 20;

const ClassificationsServicePage = ({
  rawClassifications,
  rawClassificationFamilies,
}: ClassificationServicePageProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  const [classifications, setClassifications] = useState<ClassificationResource[]>([]);
  const memoizedHits = useMemo(() => (isLoading ? [] : classifications), [isLoading, classifications]);
  const { hits, sortKey, setSortKey, sortTypes } = useSearchStateKlass(memoizedHits);

  const [selectedFamilies, setSelectedFamilies] = useState<FilterItem[]>([]);

  //TODO: Very temporary solution to get it to work with the new checkbox component
  const classificationTypes = [
    { label: ClassificationType.Klassifikasjon, value: ClassificationType.Klassifikasjon },
    { label: ClassificationType.Kodeliste, value: ClassificationType.Kodeliste },
  ];

  const classificationFamilyTypes = rawClassificationFamilies.map((f: ClassificationFamilyResource) => ({
    label: f.name,
    value: String(f.id),
  }));

  // Default are all classificationtypes selected
  const [selectedClassificationTypes, setSelectedClassificationTypes] = useState<FilterItem[]>(classificationTypes);

  const totalPages = Math.ceil(classifications.length / PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(0);

  const toggleClassificationType = (filter: FilterItem) =>
    setSelectedClassificationTypes((prev) =>
      prev.some((item) => item.value === filter.value)
        ? prev.filter((c) => c.value !== filter.value)
        : [...prev, filter],
    );

  const toggleFamily = (filter: FilterItem) =>
    setSelectedFamilies((prev) =>
      prev.some((item) => item.value === filter.value)
        ? prev.filter((c) => c.value !== filter.value)
        : [...prev, filter],
    );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage - 1);
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [selectedFamilies, selectedClassificationTypes]);

  /**
   * The pipeline for filtering page content.
   */
  useEffect(() => {
    async function loadClassifications() {
      setLoading(true);
      setError(null);
      try {
        let data: ClassificationResource[] = [];

        if (selectedFamilies.length > 0) {
          for (const family of selectedFamilies) {
            const familyData = await getClassificationFamily(
              family.value,
              selectedClassificationTypes.some((ct) => ct.value === ClassificationType.Kodeliste),
            );
            const familyClassifications: ClassificationResource[] = familyData.classifications ?? [];

            data.push(...(familyClassifications ?? []));
          }
        }
        // Refetch data to refill all deselected to select
        else {
          data = [...rawClassifications];
        }
        // apply filters
        setClassifications(
          data.filter(
            (c) => c.classificationType && selectedClassificationTypes.some((ct) => ct.value === c.classificationType),
          ),
        );
        // biome-ignore lint/suspicious/noExplicitAny: <ignoring for now>
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadClassifications();
  }, [selectedFamilies, selectedClassificationTypes, rawClassifications]);

  if (!rawClassifications) {
    return <Spinner aria-label='Laster klassifikasjoner' />;
  }

  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  // Slice search hits for paginated pages
  const startIndex = currentPage * PAGE_SIZE;
  const pagedHits = hits.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <SearchPage
      asideContent={
        <FiltersPanel>
          <CheckboxFilter
            filterHeading='Område'
            filters={classificationTypes}
            selectedItems={selectedClassificationTypes}
            onFilterChange={toggleClassificationType}
          />
          <CheckboxFilter
            filterHeading='Familie'
            filters={classificationFamilyTypes}
            selectedItems={selectedFamilies}
            onFilterChange={toggleFamily}
          />
        </FiltersPanel>
      }
      searchLabel='Søk i klassifikasjoner'
      infoContent={
        <Alert data-color={'warning'} className='infoAlert' data-size={'md'} style={{ marginBottom: '1rem' }}>
          Klassifikasjoner er ikke klar for testing.
        </Alert>
      }
      sortOptions={sortTypes}
      sortValue={sortKey}
      onSortChange={(key: string) => setSortKey(key as SortTypes)}
      totalHits={hits.length}
      searchResult={
        <>
          {isLoading ? (
            <Spinner aria-label='Laster klassifikasjoner' />
          ) : hits.length === 0 ? (
            <div>{localization.search.noHits}</div>
          ) : (
            <SearchHitContainer
              searchHits={pagedHits}
              renderHit={(hit) => (
                <ClassificationSearchHit key={hit.id} classification={hit as ClassificationResource} />
              )}
              noSearchHits={hits.length === 0}
              onPageChange={handlePageChange}
              paginationInfo={{
                currentPage: currentPage + 1,
                totalPages,
              }}
            />
          )}
        </>
      }
    />
  );
};

export default ClassificationsServicePage;
