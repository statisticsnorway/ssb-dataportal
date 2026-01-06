'use client';

import { useEffect, useMemo, useState } from 'react';
import { getClassificationFamily } from '@/libs/data/classificationFamilyData';
import { ClassificationFamilyResource, ClassificationResource } from '@/libs/data-access/klass';
import { ClassificationType } from '@/types/classification';
import { FilterGroup } from '@/types/filters';
import { useKlassTabData } from '@/utils/klassTabContext';
import ClassificationsServicePage from './classifications-service-page';

export default function Classifications() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const klassData = useKlassTabData();

  if (!klassData) return <div>Loading...</div>;

  const [classifications, setClassifications] = useState<ClassificationResource[]>(
    klassData.klassClassifications ?? [],
  );
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

  //TODO: This is console logs for development.
  // We dont want to expose this to the public and it should be removed
  useEffect(() => {
    console.log('Selected classification types', selectedClassificationTypes);
  }, [selectedClassificationTypes]);

  useEffect(() => {
    console.log('Selected classification families', selectedFamilies);
  }, [selectedFamilies]);

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
    if (klassData?.klassClassificationFamilies && klassData?.klassClassificationFamilies.length != 0) {
      groups.push({
        filterHeading: 'Område',
        filters: klassData.klassClassificationFamilies.map((f: ClassificationFamilyResource) => ({
          label: f.name,
          value: String(f.id),
        })),
        selectedItems: selectedFamilies,
        onFilterChange: setSelectedFamilies,
      });
    }
    return groups;
  }, [klassData?.klassClassificationFamilies, selectedFamilies, selectedClassificationTypes]);

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
            console.log('Family', familyData);
            const familyClassifications: ClassificationResource[] = familyData.classifications ?? [];

            data.push(...(familyClassifications ?? []));
          }
        }
        // Refetch data to refill all deselected to select
        else if (klassData?.klassClassifications?.length > 0) {
          data = [...klassData.klassClassifications];
        }

        // Step 2: apply local filters
        //data = data?.filter((c) => selectedClassificationTypes.includes(c.classificationType));
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
  }, [pagination.currentPage, selectedClassificationTypes, selectedFamilies, klassData?.klassClassifications]);

  if (!klassData) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  return (
    <ClassificationsServicePage
      rawHits={classifications}
      isLoading={loading}
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      onPageChange={handlePageChange}
      filterGroups={filterGroups}
    />
  );
}
