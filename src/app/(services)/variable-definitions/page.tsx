import { testVardefData } from '@/utils/mock-data';
import VariableDefinitionsServicePage from './variable-definitions-service-page';

export default async function VariableDefinitions() {
  const variableDefinitions = testVardefData;
  if (!variableDefinitions) {
    return <div>Loading...</div>;
  }

  return <VariableDefinitionsServicePage rawHits={variableDefinitions} isLoading={false} />;
}
