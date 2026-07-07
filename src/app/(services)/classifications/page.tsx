import { Metadata } from 'next';
import { fetchAllClassifications } from '@/libs/data/classifications/classificationData';
import { fetchSearchResult } from '@/libs/data/classifications/searchData';
import { localization } from '@/libs/language';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import { fetchStaticSubjectFields } from '@/utils/mock-data';
import { regionFamily } from '@/utils/subjectFieldsMapping';
import ClassificationsServicePage from './classifications-service-page';

export const metadata: Metadata = {
  title: localization.pageTitle.classifications,
};

export default async function Classifications({
  searchParams,
}: {
  readonly searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const logger = createLogger('classifications-discover-page');
  logger.info({ params }, 'Classifications page access');

  const subjectFieldsPromise = fetchStaticSubjectFields()
    .then((data) => ({
      data: data.some((field) => String(field.code) === regionFamily.code) ? data : [...data, regionFamily],
      error: null,
    }))
    .catch((error) => {
      logger.error({ error: sanitizeError(error) }, 'Failed to load subject fields');
      return { data: [regionFamily], error };
    });

  const classificationsPromise = fetchAllClassifications()
    .then((data) => ({ data, error: null }))
    .catch((error) => {
      logger.error({ error: sanitizeError(error) }, 'Failed to load classifications');
      return { data: [], error };
    });

  const searchResultPromise = fetchSearchResult({ query: params.q?.toString() ?? '', includeCodelists: true })
    .then((data) => ({ data, error: null }))
    .catch((error) => {
      logger.error({ error: sanitizeError(error) }, 'Failed to load search results');
      return { data: [], error };
    });

  return (
    <ClassificationsServicePage
      classificationsPromise={classificationsPromise}
      subjectFieldsPromise={subjectFieldsPromise}
      searchResultPromise={searchResultPromise}
      isSearchActive={Boolean(params.q?.toString().trim())}
    />
  );
}
