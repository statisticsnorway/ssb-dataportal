'use client';

import { useEffect, useMemo, useState } from 'react';
import { Classification, ClassificationFamily, ClassificationType } from '@/types/classification';
import { FilterGroup } from '@/types/filters';
import { useMetadata } from '@/utils/metadataProvider';
import ClassificationsServicePage from './classifications-service-page';

export default function Classifications() {
  const { klassData } = useMetadata();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  // Default are all classificationtypes selected in order to work with the logic of filtering and combining with other filters
  const [selectedClassificationTypes, setSelectedClassificationTypes] = useState<string[]>([
    ClassificationType.Klassifikasjon,
    ClassificationType.Kodeverk,
  ]);

  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
  });

  const PAGE_SIZE = 20;

  const familyOne = [
    {
      id: '1',
      name: 'Standard for X',
      classificationType: ClassificationType.Klassifikasjon,
      lastModified: '2024-03-05',
      _links: {
        self: { href: '/api/classification/1' },
      },
    },
  ];
  const familyTwo = [
    {
      id: '2',
      name: 'Kodeliste Y',
      classificationType: ClassificationType.Kodeverk,
      lastModified: '2024-03-05',
      _links: {
        self: { href: '/api/classification/2' },
      },
    },
  ];

  //TODO: This is console logs for development, We dont want to expose this to the public and it should be removed
  useEffect(() => {
    console.log('Selected classification types', selectedClassificationTypes);
  }, [selectedClassificationTypes]);

  useEffect(() => {
    console.log('Selected classification families', selectedFamilies);
  }, [selectedFamilies]);

  useEffect(() => {
    console.log('All classifications', classifications);
  }, [classifications]);

  // Filter groups
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
        { label: ClassificationType.Kodeverk, value: ClassificationType.Kodeverk },
      ],
      selectedItems: selectedClassificationTypes,
      onFilterChange: setSelectedClassificationTypes,
    });

    // Only add this filter if it is possible to fetch clasification families
    if (klassData?.klassClassificationFamilies) {
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
    setPagination((prev) => ({ ...prev, currentPage: newPage - 1 }));
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
            const family = id === '1' ? familyOne : familyTwo;
            data.push(...(family ?? []));
          }
          // We should not use this combination of fetching data, but we must be sure pagination and filtering is correct before removing
        } else if (klassData?.klassClassifications?.length) {
          data = [...klassData.klassClassifications];
        } else {
          const res = await fetch(
            `/api/classifications?includeCodelists=${selectedClassificationTypes.includes(ClassificationType.Kodeverk)}&page=${pagination.currentPage}&size=${PAGE_SIZE}`,
          );
          const apiData = await res.json();
          data = apiData.classifications;
        }

        // Step 2: apply local filters
        data = data.filter((c) => selectedClassificationTypes.includes(c.classificationType));

        // Step 3: pagination
        const totalItems = data.length;
        setPagination((prev) => ({
          ...prev,
          totalPages: Math.ceil(totalItems / PAGE_SIZE),
        }));

        const start = pagination.currentPage * PAGE_SIZE;
        data = data.slice(start, start + PAGE_SIZE);

        setClassifications(data);
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }, [pagination.currentPage, selectedClassificationTypes]);

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
