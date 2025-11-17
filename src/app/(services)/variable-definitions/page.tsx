'use client';

import { useMemo, useState } from 'react';
import { FilterGroup } from '@/types/filters';
import { useVardefTabData } from '@/utils/vardefTabContext';
import VariableDefinitionsServicePage from './variable-definitions-service-page';

export default function VariableDefinitions() {
  const [selectedVariableDefinitions, setSelectedVariableDefinitions] = useState<string[]>([]);

  const filterGroups: FilterGroup[] = useMemo(() => {
    const groups: FilterGroup[] = [
      {
        filterHeading: 'Status',
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

  const vardefData = useVardefTabData();

  if (!vardefData) {
    return <div>Loading...</div>;
  }

  const { variableDefinitions } = vardefData;

  return <VariableDefinitionsServicePage rawHits={variableDefinitions} filterGroups={filterGroups} isLoading={false} />;
}
