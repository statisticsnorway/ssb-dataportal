'use client';

import VariableDefinitionsServicePage from "./variable-definitions-service-page";
import { useMemo, useState } from "react";
import { FilterGroup } from "@/types/filters";

export default function VariableDefinitions() {
    
    const [selectedVariableDefinitions, setSelectedVariableDefinitions] = useState<string[]>([]);

    const filterGroups: FilterGroup[] = useMemo(() => {
        const groups: FilterGroup[] = [
            {
                filterHeading: "Status",
                filters: [
                    { label: 'Utkast', value: 'draft' },
                    { label: 'Publisert internt', value: 'published-internal' },
                    { label: 'Publisert eksternt', value: 'published-external' },
                ],
                selectedItems: selectedVariableDefinitions,
                onFilterChange: setSelectedVariableDefinitions,
            },
        ];
        return groups;
    }, [selectedVariableDefinitions]);


    //const vardefData = useVardefTabData();

    /*if (!vardefData) {
        return <div>Loading...</div>;
    }*/
    
    const variableDefinitions = [
        {
            id:"hgk",
            name:"name",
            short_name:"short",
            definition: "Bla bla bla",
            last_updated_at: "2025-01-01",
            valid_from: "2025-10-12",
            contains_special_categories_of_personal_data: false,
            contact: {
                title: "Boss",
                email: "boss@ssb.no",
            },
        },
    ];  

    return (
        <VariableDefinitionsServicePage
            rawHits={variableDefinitions}
            filterGroups={filterGroups}
            isLoading={false}
        />
    );
}