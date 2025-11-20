'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchClassifications } from '@/libs/data/classificationData';
import { getClassificationFamily } from '@/libs/data/classificationFamilyData';
import { Classification, ClassificationFamily, ClassificationType } from '@/types/classification';
import { FilterGroup } from '@/types/filters';
import { useKlassTabData } from '@/utils/klassTabContext';
import ClassificationsServicePage from './classifications-service-page';

export default function Classifications() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  // Default are all classificationtypes selected in order to work with the logic of filtering and combining with other filters
  const [selectedClassificationTypes, setSelectedClassificationTypes] = useState<string[]>([
    ClassificationType.Klassifikasjon,
    ClassificationType.Kodeliste,
  ]);

  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
  });

  const PAGE_SIZE = 20;

  const klassData = useKlassTabData();

  //TODO: This is console logs for development, We dont want to expose this to the public and it should be removed
  useEffect(() => {
    console.log('Selected classification types', selectedClassificationTypes);
  }, [selectedClassificationTypes]);

  useEffect(() => {
    console.log('Klass data', klassData);
  }, [klassData]);

  useEffect(() => {
    console.log('Selected classification families', selectedFamilies);
  }, [selectedFamilies]);

  useEffect(() => {
    console.log('All classifications', classifications);
  }, [classifications]);

  /**
   * Creating a list of filters by creating and adding filtergroups.
   *
   * This should be made generic and props should be a list.
   * How to handle conditionally filters? A prop?
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
        filters: klassData.klassClassificationFamilies.map((f: ClassificationFamily) => ({
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
   * The pipeline for filtering and paginating page content.
   */
  useEffect(() => {
    async function loadClassifications() {
      setLoading(true);
      setError(null);
      try {
        let data: Classification[] = [];

        if (selectedFamilies.length > 0) {
          for (const id of selectedFamilies) {
            const familyData = await getClassificationFamily(
              id,
              selectedClassificationTypes.includes(ClassificationType.Kodeliste),
            );
            console.log('Family', familyData);
            const familyClassifications: Classification[] = familyData.classifications;

            data.push(...(familyClassifications ?? []));
          }
          // We should not use this combination of fetching data, but we must be sure pagination and filtering is correct before removing
        } else if (klassData?.klassClassifications?.length > 0) {
          data = [...klassData.klassClassifications];
        } else {
          const apiData = await fetchClassifications({
            page: String(pagination.currentPage),
            size: String(PAGE_SIZE),
            includeCodelists: selectedClassificationTypes.includes(ClassificationType.Kodeliste),
          });
          data = apiData.classifications;
        }

        // Step 2: apply local filters
        data = data?.filter((c) => selectedClassificationTypes.includes(c.classificationType));

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
    //TODO: The use of +1/-1 is a temporary fix for starting with 0. Should be handled elsewhere
    <ClassificationsServicePage
      rawHits={classifications}
      isLoading={loading}
      currentPage={pagination.currentPage + 1}
      totalPages={pagination.totalPages - 1}
      onPageChange={handlePageChange}
      filterGroups={filterGroups}
    />
  );
}
