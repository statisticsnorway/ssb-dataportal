import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { authenticateUser } from '@/libs/auth/userAuth';
import { getRenderedVariableDefinition } from '@/libs/data/variable-definitions/variableDefinitions';
import { VariableStatus } from '@/libs/data-access/variable-definitions/internal/models';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import VariableDefinitionDetail from './variableDefinitionDetail';

const logger = createLogger('variable-definitions:detail');

const getPageData = cache(async (shortName: string) => {
  const [auth, variableDefinition] = await Promise.all([
    authenticateUser().catch(() => ({ isAuthenticated: false })),
    getRenderedVariableDefinition(shortName),
  ]);
  return { auth, variableDefinition };
});

export async function generateMetadata({ params }: { params: Promise<{ shortName: string }> }): Promise<Metadata> {
  const { shortName } = await params;
  const { auth, variableDefinition } = await getPageData(shortName).catch(() => ({
    auth: { isAuthenticated: false },
    variableDefinition: null,
  }));
  if (!auth.isAuthenticated && variableDefinition?.variable_status !== VariableStatus.PublishedExternal) {
    return { title: shortName };
  }
  return { title: variableDefinition?.name ?? shortName };
}

export default async function VariableDefinition({ params }: { params: Promise<{ shortName: string }> }) {
  const { shortName } = await params;
  logger.info({ shortName }, 'Variable definition detail page access');

  const { auth, variableDefinition } = await getPageData(shortName).catch((error) => {
    logger.error({ shortName, error: sanitizeError(error) }, 'Failed to load variable definition details');
    return notFound();
  });

  if (!auth.isAuthenticated && variableDefinition.variable_status !== VariableStatus.PublishedExternal) {
    notFound();
  }

  const daplaLabVardefUrl: string | undefined = process.env.DAPLA_LAB_VARDEF_URL;
  return <VariableDefinitionDetail variableDefinition={variableDefinition} daplaLabVardefUrl={daplaLabVardefUrl} />;
}
