import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { authenticateUser } from '@/libs/auth/userAuth';
import { getRenderedVariableDefinition } from '@/libs/data/variable-definitions/variableDefinitions';
import { VariableStatus } from '@/libs/data-access/variable-definitions/internal/models';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import VariableDefinitionDetail from './variableDefinitionDetail';

/**
 * Fetches auth state and the rendered variable definition in parallel.
 *
 * Wrapped in React `cache()` so the data is only fetched once per request,
 * even though both `generateMetadata` and the page component call this function.
 * Authentication errors are silently caught and default to `{ isAuthenticated: false }`,
 * allowing callers to apply visibility rules based on the variable's publication status.
 *
 * @param shortName - The short name identifying the variable definition to fetch.
 * @returns An object containing the auth state and the rendered variable definition.
 */
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
  const logger = createLogger('variable-definition-detail-page');
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
