import { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { fetchAllClassifications } from '@/libs/data/classifications/classificationData';
import { fetchSubjectFieldFilterValues } from '@/libs/data/classifications/codesData';
import { fetchSearchResult } from '@/libs/data/classifications/searchData';
import { languageCookieName, localization, resolveLanguage } from '@/libs/language';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
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
  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const language = resolveLanguage(
    cookieStore.get(languageCookieName)?.value,
    requestHeaders.get('accept-language') ?? undefined,
  );
  const logger = createLogger('classifications-discover-page');
  logger.info({ params }, 'Classifications page access');

  const subjectFieldsPromise = fetchSubjectFieldFilterValues(language)
    .then((data) => ({
      data: data.some((field) => String(field.code) === regionFamily.code) ? data : [...data, regionFamily],
      error: null,
    }))
    .catch((error) => {
      logger.error({ error: sanitizeError(error) }, 'Failed to load subject fields');
      return { data: [regionFamily], error };
    });

  const classificationsPromise = fetchAllClassifications(language)
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
