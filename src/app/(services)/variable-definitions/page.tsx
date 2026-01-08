import { fetchSubjectFields } from '@/libs/data/subjectFieldLookup';
import { SubjectField } from '@/types/subjectField';
import { testVardefData } from '@/utils/mock-data';
import VariableDefinitionsServicePage from './variable-definitions-service-page';

export default async function VariableDefinitions() {
  const variableDefinitions = testVardefData;
  const subjectFields: SubjectField[] = await fetchSubjectFields();
  if (!variableDefinitions) {
    return <div>Loading...</div>;
  }

  return (
    <VariableDefinitionsServicePage rawHits={variableDefinitions} isLoading={false} subjectFields={subjectFields} />
  );
}
