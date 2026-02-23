import { notFound } from 'next/navigation';
import { getRenderedVariableDefinition } from '@/libs/data/variable-definitions/variableDefinitions';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models';
import VariableDefinitionDetail from './variableDefinitionDetail';

export default async function VariableDefinition({ params }: { params: Promise<{ shortName: string }> }) {
  const { shortName } = await params;
  const variableDefinition: RenderedView = await getRenderedVariableDefinition(shortName).catch(() => notFound());
  const daplaLabVardefUrl: string | undefined = process.env.DAPLA_LAB_VARDEF_URL;
  return <VariableDefinitionDetail variableDefinition={variableDefinition} daplaLabVardefUrl={daplaLabVardefUrl} />;
}
