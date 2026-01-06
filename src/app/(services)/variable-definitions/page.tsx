'use client';

import { useMemo, useState } from 'react';
import { fetchSubjectFields } from '@/libs/data/subjectFieldLookup';
import { FilterGroup } from '@/types/filters';
import { SubjectField } from '@/types/subjectField';
import { useVardefTabData } from '@/utils/vardefTabContext';
import VariableDefinitionsServicePage from './variable-definitions-service-page';

const subjectFields: SubjectField[] = await fetchSubjectFields();

export default function VariableDefinitions() {
  const [selectedVariableDefinitions, setSelectedVariableDefinitions] = useState<string[]>([]);

  const filterGroups: FilterGroup[] = useMemo(() => {
    const groups: FilterGroup[] = [
      {
        filterHeading: 'Statistikkområde',
        filters: subjectFields.map((f: SubjectField) => ({
          label: f.name,
          value: String(f.code),
        })),
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
