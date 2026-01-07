import { fetchSubjectFields } from '@/libs/data/subjectFieldLookup';
import { SubjectField } from '@/types/subjectField';
import { useVardefTabData } from '@/utils/vardefTabContext';
import VariableDefinitionsServicePage from './variable-definitions-service-page';

export default async function VariableDefinitions() {
  const vardefData = useVardefTabData();
  const subjectFields: SubjectField[] = await fetchSubjectFields();

  if (!vardefData) {
    return <div>Loading...</div>;
  }

  const { variableDefinitions } = vardefData;

  return (
    <VariableDefinitionsServicePage rawHits={variableDefinitions} isLoading={false} subjectFields={subjectFields} />
  );
}
