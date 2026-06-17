import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import { Metadata } from 'next';
import { ExternalLink } from '@/components/link-components/externalLink';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { fetchAllClassifications, fetchSearchResult } from '@/libs/data/classifications/classificationData';
import { localization } from '@/libs/language';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import { fetchStaticSubjectFields } from '@/utils/mock-data';
import { regionFamily } from '@/utils/subjectFieldsMapping';
import { tabsData } from '../tabs';
import ClassificationsServicePage from './classifications-service-page';

export const metadata: Metadata = {
  title: localization.pageTitle.classifications,
};

const showInfoOnly = process.env.HIDE_CLASSIFICATIONS === 'true';

const renderInfoOnlyPage = () => {
  return (
    <SearchPage
      tabsId={tabsData.Classifications.id}
      header={localization.tabs.classifications}
      infoContent={
        <Alert data-color='info'>
          <Heading className='infoHeadingSecondary' level={2}>
            {localization.info.classificationsPrototypeIntro}
          </Heading>
          <Paragraph>
            {localization.info.classificationsPrototypeInfo}{' '}
            <ExternalLink href='https://www.ssb.no/klass/' linkText='ssb.no/klass' />
          </Paragraph>
        </Alert>
      }
    />
  );
};

export default async function Classifications({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const logger = createLogger('classifications-discover-page');
  logger.info({ params }, 'Classifications page access');

  if (showInfoOnly) {
    logger.info('Classifications page is running in info-only mode');
    return renderInfoOnlyPage();
  }

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
    />
  );
}
