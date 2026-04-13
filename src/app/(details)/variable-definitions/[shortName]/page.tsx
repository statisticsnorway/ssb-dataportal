import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { getRenderedVariableDefinition } from '@/libs/data/variable-definitions/variableDefinitions';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import VariableDefinitionDetail from './variableDefinitionDetail';

const getPageData = cache(async (shortName: string) => {
  const variableDefinition = await getRenderedVariableDefinition(shortName);
  return { variableDefinition };
});

export async function generateMetadata({ params }: { params: Promise<{ shortName: string }> }): Promise<Metadata> {
  const { shortName } = await params;
  const { variableDefinition } = await getPageData(shortName).catch(() => ({ variableDefinition: null }));
  return { title: variableDefinition?.name ?? shortName };
}

export default async function VariableDefinition({ params }: { params: Promise<{ shortName: string }> }) {
  const logger = createLogger('variable-definition-detail-page');
  const { shortName } = await params;
  logger.info({ shortName }, 'Variable definition detail page access');

  const { variableDefinition } = await getPageData(shortName).catch((error) => {
    logger.error({ shortName, error: sanitizeError(error) }, 'Failed to load variable definition details');
    return notFound();
  });

  const daplaLabVardefUrl: string | undefined = process.env.DAPLA_LAB_VARDEF_URL;
  return <VariableDefinitionDetail variableDefinition={variableDefinition} daplaLabVardefUrl={daplaLabVardefUrl} />;
}
