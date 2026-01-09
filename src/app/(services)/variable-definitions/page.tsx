import { listRenderedVariableDefinitions } from '@/libs/data/variableDefinitions';
import VariableDefinitionsServicePage from './variable-definitions-service-page';

export default async function VariableDefinitions() {
  const variableDefinitions = await listRenderedVariableDefinitions();
  if (!variableDefinitions) {
    return <div>Loading...</div>;
  }

  return <VariableDefinitionsServicePage rawHits={variableDefinitions} isLoading={false} />;
}
