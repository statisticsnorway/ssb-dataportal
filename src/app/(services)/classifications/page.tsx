'use client'

import ClassificationsServicePage from "./classifications-service-page";
import { Classification, ClassificationType } from "@/types/classification";
import { FilterGroup } from "@/types/filters";
import { KlassTabData } from "@/utils/klassTabContext";
import { useEffect, useMemo, useState } from "react";

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

    // This data is fetched server side and saved in context
    const klassData: KlassTabData | null = null;
    const classificationList = [
        {
            id: 1234,
            name: "class name",
            classificationType: ClassificationType.Klassifikasjon,
            lastModified: '2025-01-01',

        },
        {
            id: 3456,
            name: "nombre",
            classificationType: ClassificationType.Kodeliste,
            lastModified: '2024-01-01',

        }
    ]

    const PAGE_SIZE = 20;


    //TODO: This is console logs for development, We dont want to expose this to the public and it should be removed
    useEffect(() => {
        console.log("Selected classification types", selectedClassificationTypes)
    }, [selectedClassificationTypes]);

    useEffect(() => {
        console.log("Selected classification families", selectedFamilies)
    }, [selectedFamilies]);

    useEffect(() => {
        console.log("All classifications", classifications)
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
                { label: ClassificationType.Kodeliste, value: ClassificationType.Kodeliste },
            ],
            selectedItems: selectedClassificationTypes,
            onFilterChange: setSelectedClassificationTypes,
        });

        // Only add this filter if it is possible to fetch clasification families
        //if (klassData?.klassClassificationFamilies) {
        //    groups.push({
        //        filterHeading: 'Område',
        //        filters: klassData.klassClassificationFamilies.map((f: ClassificationFamily) => ({
        //            label: f.name,
        //            value: String(f.id),
        //        })),
        //        selectedItems: selectedFamilies,
        //        onFilterChange: setSelectedFamilies,
        //    });
        //}
        return groups;
    }, [selectedFamilies, selectedClassificationTypes]);

    const handlePageChange = (newPage: number) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage - 1 }));
    };

    /**
    * The pipeline for filtering and paginating page content.
    */
    // Pipeline: filter & paginate
    useEffect(() => {
        setLoading(true);
        setError(null);
        try {
            // Step 1: Use local classificationList for testing
            let data = [...classificationList];

            // Step 2: apply local filters
            data = data.filter(c => selectedClassificationTypes.includes(c.classificationType));

            // Step 3: pagination
            const totalItems = data.length;
            setPagination(prev => ({
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