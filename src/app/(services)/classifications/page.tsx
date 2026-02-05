import { Alert, Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import { SearchPage } from '@/components/search-page-wrapper';
import { localization } from '@/libs/language';

export default async function Classifications() {
  const pageContent = (
    <Alert data-color='info'>
      <Heading>{localization.info.classificationsPrototypeIntro}</Heading>
      <Paragraph>
        {localization.info.classificationsPrototypeInfo} <Link href={'https://www.ssb.no/klass/'}>ssb.no/klass</Link>
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
