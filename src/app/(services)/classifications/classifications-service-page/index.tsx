'use client';

import { Alert, Spinner } from '@digdir/designsystemet-react';
import { useEffect, useMemo, useState } from 'react';
import { FiltersPanel } from '@/components/filter';
import { SearchHitContainer } from '@/components/search-page-wrapper/search-hits-container';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { SortTypes, useSearchStateKlass } from '@/hooks/useSearchStateKlass';
import { getClassificationFamily } from '@/libs/data/classificationFamilyData';
import { ClassificationFamilyResource, ClassificationResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import { ClassificationType } from '@/types/classification';
import { FilterGroup } from '@/types/filters';
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

  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);

  // Default are all classificationtypes selected
  const [selectedClassificationTypes, setSelectedClassificationTypes] = useState<string[]>([
    ClassificationType.Klassifikasjon,
    ClassificationType.Kodeliste,
  ]);

  const totalPages = Math.ceil(classifications.length / PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(0);

  /**
   * Creating a list of filters
   */
  const filterGroups: FilterGroup[] = useMemo(() => {
    const groups: FilterGroup[] = [];

    // Type filter
    groups.push({
      filterHeading: 'Kodeverk type',
      filters: [
        { label: ClassificationType.Klassifikasjon, value: ClassificationType.Klassifikasjon },
        { label: ClassificationType.Kodeverk, value: ClassificationType.Kodeliste },
      ],
      selectedItems: selectedClassificationTypes,
      onFilterChange: setSelectedClassificationTypes,
    });

    // Only add this filter if it is possible to fetch clasification families
    if (rawClassificationFamilies?.length > 0) {
      groups.push({
        filterHeading: 'Område',
        filters: rawClassificationFamilies.map((f: ClassificationFamilyResource) => ({
          label: f.name,
          value: String(f.id),
        })),
        selectedItems: selectedFamilies,
        onFilterChange: setSelectedFamilies,
      });
    }
    return groups;
  }, [selectedFamilies, selectedClassificationTypes]);

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

        /*
        if (selectedFamilies.length > 0) {
          for (const id of selectedFamilies) {
            const familyData = await getClassificationFamily(
              id,
              selectedClassificationTypes.includes(ClassificationType.Kodeliste),
            );
            const familyClassifications: ClassificationResource[] = familyData.classifications ?? [];

            data.push(...(familyClassifications ?? []));
          }
        }
        // Refetch data to refill all deselected to select
        else {
          data = [...rawClassifications];
        }
*/
        if (selectedFamilies.length > 0) {
          const familyDataArray = await Promise.all(
            selectedFamilies.map((id) =>
              getClassificationFamily(id, selectedClassificationTypes.includes(ClassificationType.Kodeliste)),
            ),
          );
          data = familyDataArray.flatMap((f) => f.classifications ?? []);
        } else {
          data = [...rawClassifications];
        }
        // apply filters
        setClassifications(
          data.filter((c) => c.classificationType && selectedClassificationTypes.includes(c.classificationType)),
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
      asideContent={filterGroups ? <FiltersPanel filterGroups={filterGroups} /> : null}
      searchLabel='Søk i klassifikasjoner'
      infoContent={
        <Alert data-color={'warning'} className='infoAlert' data-size={'md'}>
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
