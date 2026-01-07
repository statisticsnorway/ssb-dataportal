import { getVariableDefinitionById } from '@/utils/mock-data';
import VariableDefinitionDetails from './variableDefinitionDetail';

export default async function VariableDefinition({ params }: { params: { id: string } }) {
  // await is Next necessary
  const { id } = await params;
  const variableDefinition = getVariableDefinitionById(id);

  if (!variableDefinition) {
    return <div>Variabeldefinisjon ikke funnet</div>;
  }

  return <VariableDefinitionDetails variableDefinition={variableDefinition} />;
}
