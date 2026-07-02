import { Metadata } from 'next';
import { listRenderedVariableDefinitions } from '@/libs/data/variable-definitions/variableDefinitions';
import { localization } from '@/libs/language';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import { fetchStaticSubjectFields } from '@/utils/mock-data';
import VariableDefinitionsServicePage from './variable-definitions-service-page';

export const metadata: Metadata = {
  title: localization.pageTitle.variableDefinitions,
};

export const revalidate = 3600;

export default async function VariableDefinitions() {
  const logger = createLogger('variable-definitions-discover-page');
  logger.info('Variable definitions page access');

  const subjectFieldsPromise = fetchStaticSubjectFields()
    .then((data) => ({ data, error: null }))
    .catch((error) => {
      logger.error({ error: sanitizeError(error) }, 'Failed to load subject fields');
      return { data: [], error };
    });

  const variableDefsPromise = listRenderedVariableDefinitions()
    .then((data) => ({ data, error: null }))
    .catch((error) => {
      logger.error({ error: sanitizeError(error) }, 'Failed to load variable definitions');
      return { data: [], error };
    });

  return (
    <VariableDefinitionsServicePage
      variablesPromise={variableDefsPromise}
      subjectFieldsPromise={subjectFieldsPromise}
    />
  );
}
