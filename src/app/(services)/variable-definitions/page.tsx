import { Metadata } from 'next';
import { fetchSubjectFieldFilterValues } from '@/libs/data/classifications/codesData';
import { listRenderedVariableDefinitions } from '@/libs/data/variable-definitions/variableDefinitions';
import { localization } from '@/libs/language';
import { getRequestLanguage } from '@/libs/language/src/getRequestLanguage';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import VariableDefinitionsServicePage from './variable-definitions-service-page';

export const metadata: Metadata = {
  title: localization.pageTitle.variableDefinitions,
};

export default async function VariableDefinitions({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const params = await searchParams;
  const language = await getRequestLanguage();
  const logger = createLogger('variable-definitions-discover-page');
  logger.info({ params }, 'Variable definitions page access');

  const subjectFieldsPromise = fetchSubjectFieldFilterValues(language)
    .then((data) => ({ data, error: null }))
    .catch((error) => {
      logger.error({ error: sanitizeError(error) }, 'Failed to load subject fields');
      return { data: [], error };
    });

  const variableDefsPromise = listRenderedVariableDefinitions(language)
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
