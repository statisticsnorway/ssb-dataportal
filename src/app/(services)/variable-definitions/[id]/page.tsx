import { getRenderedVariableDefinition } from '@/libs/data/variable-definitions/variableDefinitions';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models';
import VariableDefinitionDetail from './variableDefinitionDetail';

export default async function VariableDefinition({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let variableDefinition: RenderedView | undefined = undefined;
  try {
    variableDefinition = await getRenderedVariableDefinition(id);
  } catch (error: unknown) {
    console.error('Could not fetch variable definition', error);
  }
  const daplaLabVardefUrl: string | undefined = process.env.DAPLA_LAB_VARDEF_URL;

  return <VariableDefinitionDetail variableDefinition={variableDefinition} daplaLabVardefUrl={daplaLabVardefUrl} />;
}
