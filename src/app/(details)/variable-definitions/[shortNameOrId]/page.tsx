import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import {
  getRenderedVariableDefinitionById as getVariableDefinitionById,
  getVariableDefinitionByShortName,
} from '@/libs/data/variable-definitions/variableDefinitions';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import { getVardefApiDocsUrl } from '@/utils/config';
import VariableDefinitionDetail from './variableDefinitionDetail';

const variableDefinitionIdLength = 8;
/**
 * Fetches and caches page data for a variable definition by its short name OR ID.
 */
const getPageData = cache(async (shortNameOrId: string) => {
  const logger = createLogger('variable-definition-detail-page');
  let variableDefinition: RenderedView | undefined = undefined;
  if (shortNameOrId.length === variableDefinitionIdLength) {
    variableDefinition = await getVariableDefinitionById(shortNameOrId);
    if (variableDefinition !== undefined) {
      logger.debug(`Identified ${shortNameOrId} as ID, fetched variable definition ${variableDefinition.name}`);
    }
  }
  if (variableDefinition === undefined) {
    variableDefinition = await getVariableDefinitionByShortName(shortNameOrId);
    logger.debug(`Identified ${shortNameOrId} as short name, fetched variable definition ${variableDefinition.name}`);
  }
  return { variableDefinition };
});

export async function generateMetadata({ params }: { params: Promise<{ shortNameOrId: string }> }): Promise<Metadata> {
  const { shortNameOrId } = await params;
  const { variableDefinition } = await getPageData(shortNameOrId).catch(() => ({ variableDefinition: null }));
  return { title: variableDefinition?.name ?? shortNameOrId };
}

export default async function VariableDefinition({ params }: Readonly<{ params: Promise<{ shortNameOrId: string }> }>) {
  const logger = createLogger('variable-definition-detail-page');
  const { shortNameOrId } = await params;
  logger.info({ shortNameOrId }, 'Variable definition detail page access');

  const { variableDefinition } = await getPageData(shortNameOrId).catch((error) => {
    logger.error({ shortNameOrId, error: sanitizeError(error) }, 'Failed to load variable definition details');
    return notFound();
  });

  const daplaLabVardefUrl: string | undefined = process.env.DAPLA_LAB_VARDEF_URL;

  return (
    <VariableDefinitionDetail
      variableDefinition={variableDefinition}
      daplaLabVardefUrl={daplaLabVardefUrl}
      apiDocsBaseUrl={getVardefApiDocsUrl()}
    />
  );
}
