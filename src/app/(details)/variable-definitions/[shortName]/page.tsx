import { notFound } from 'next/navigation';
import { getRenderedVariableDefinition } from '@/libs/data/variable-definitions/variableDefinitions';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import VariableDefinitionDetail from './variableDefinitionDetail';

const logger = createLogger('variable-definitions:detail');

export default async function VariableDefinition({ params }: { params: Promise<{ shortName: string }> }) {
  const { shortName } = await params;
  logger.info({ shortName }, 'Variable definition detail page access');

  const variableDefinition: RenderedView = await getRenderedVariableDefinition(shortName).catch((error) => {
    logger.error({ shortName, error: sanitizeError(error) }, 'Failed to load variable definition details');
    notFound();
  });

  const daplaLabVardefUrl: string | undefined = process.env.DAPLA_LAB_VARDEF_URL;
  return <VariableDefinitionDetail variableDefinition={variableDefinition} daplaLabVardefUrl={daplaLabVardefUrl} />;
}
