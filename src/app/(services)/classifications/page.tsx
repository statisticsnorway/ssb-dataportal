import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import { Metadata } from 'next';
import { ExternalLink } from '@/components/link-components/externalLink';
import { SearchPage } from '@/components/search-page-wrapper';
import { localization } from '@/libs/language';
import { tabsData } from '../tabs';

export const metadata: Metadata = {
  title: localization.pageTitle.classifications,
};

export default async function Classifications() {
  const pageInfo = (
    <Alert data-color='info' data-size='lg'>
      <Heading level={2}>{localization.info.classificationsPrototypeIntro}</Heading>
      <Paragraph>
        {localization.info.classificationsPrototypeInfo}{' '}
        <ExternalLink href={'https://www.ssb.no/klass/'} linkText='ssb.no/klass' />
      </Paragraph>
    </Alert>
  );

  return (
    <SearchPage
      tabsId={tabsData.Classifications.id}
      header={localization.tabs.classifications}
      searchLabel={localization.search.searchForClassifications}
      searchResult={pageInfo}
    ></SearchPage>
  );
}
