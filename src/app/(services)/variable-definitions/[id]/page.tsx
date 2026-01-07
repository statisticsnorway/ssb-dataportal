import { getVariableDefinitionById } from '@/utils/mock-data';
import VariableDefinitionDetail from './variableDefinitionDetail';

export default async function VariableDefinition({ params }: { params: { id: string } }) {
  // await is necessary for Next
  const { id } = await params;
  const variableDefinition = getVariableDefinitionById(id);

  if (!variableDefinition) {
    return <div>Variabeldefinisjon ikke funnet</div>;
  }

  return <VariableDefinitionDetail variableDefinition={variableDefinition} />;
}
