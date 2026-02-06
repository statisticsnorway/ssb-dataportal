import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import { ExternalLink } from '@/components/external-link';
import { SearchPage } from '@/components/search-page-wrapper';
import { localization } from '@/libs/language';

export default async function Classifications() {
  const pageContent = (
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
      header={localization.tabs.classifications}
      searchLabel={localization.search.searchForClassifications}
      infoContent={
        <Alert data-color={'warning'} className='infoAlert' data-size={'md'}>
          Klassifikasjoner er ikke klar for testing.
        </Alert>
      }
      searchResult={pageContent}
    ></SearchPage>
  );
}
