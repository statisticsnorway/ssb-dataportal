'use client';

import { Alert } from '@digdir/designsystemet-react';
import { useEffect, useMemo, useState } from 'react';
import { SearchHitContainer } from '@/components/search-page-wrapper/search-hits-container';
import SearchPage from '@/components/search-page-wrapper/search-page/searchPage';
import { SortTypes, useSearchStateKlass } from '@/hooks/useSearchStateKlass';
import { getClassificationFamily } from '@/libs/data/classificationFamilyData';
import { ClassificationFamilyResource, ClassificationResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import { ClassificationType } from '@/types/classification';
import { FilterGroup } from '@/types/filters';
import { ClassificationSearchHit } from '../components/classificationSearchHit';

interface ClassificationServicePageProps {
  rawClassifications: ClassificationResource[];
  rawClassificationFamilies: ClassificationFamilyResource[];
}

const ClassificationsServicePage = ({
  rawClassifications,
  rawClassificationFamilies,
}: ClassificationServicePageProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [classifications, setClassifications] = useState(rawClassifications ? rawClassifications : []);
  const memoizedHits = useMemo(() => (isLoading ? [] : classifications), [isLoading, classifications]);

  const { hits, sortKey, setSortKey, sortTypes } = useSearchStateKlass(memoizedHits);

  if (!classifications) return <div>Loading...</div>;

  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);

  // Default are all classificationtypes selected
  const [selectedClassificationTypes, setSelectedClassificationTypes] = useState<string[]>([
    ClassificationType.Klassifikasjon,
    ClassificationType.Kodeliste,
  ]);

  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
  });

  const PAGE_SIZE = 20;

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
    if (rawClassificationFamilies && rawClassificationFamilies.length != 0) {
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
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage - 1,
    }));
  };

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
        else if (classifications?.length > 0) {
          data = [...classifications];
        }

        // Step 2: apply local filters
        data = data.filter((c) => c.classificationType && selectedClassificationTypes.includes(c.classificationType));

        // compute totalPages first
        const totalPages = Math.ceil(data.length / PAGE_SIZE);

        // snapshot currentPage
        let currentPage = pagination.currentPage;
        if (currentPage >= totalPages) currentPage = 0; // reset if needed

        // update state
        setPagination({ currentPage, totalPages });

        setClassifications(data);
        // biome-ignore lint/suspicious/noExplicitAny: <ignoring for now>
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadClassifications();
  }, [pagination.currentPage, selectedClassificationTypes, selectedFamilies]);

  if (!rawClassifications) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data: {error}</div>;
  }
  //const startIndex = pagination.currentPage * PAGE_SIZE;
  //const pagedHits = hits.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <SearchPage
      filterGroups={filterGroups}
      searchLabel='Søk i klassifikasjoner'
      infoContent={
        <Alert data-color={'warning'} className='infoAlert' data-size={'md'}>
          Klassifikasjoner er ikke klar for testing.
        </Alert>
      }
      sortOptions={sortTypes}
      sortValue={sortKey}
      onSortChange={(key: string) => setSortKey(key as SortTypes)}
      searchResult={
        <>
          {isLoading ? (
            <div>Loading...</div>
          ) : hits.length === 0 ? (
            <div>{localization.search.noHits}</div>
          ) : (
            <SearchHitContainer
              searchHits={hits}
              renderHit={(hit) => (
                <ClassificationSearchHit key={hit.id} classification={hit as ClassificationResource} />
              )}
              noSearchHits={false}
              onPageChange={handlePageChange}
              paginationInfo={{
                currentPage: pagination.currentPage + 1,
                totalPages: pagination.totalPages,
              }}
            />
          )}
        </>
      }
    />
  );
};

export default ClassificationsServicePage;
