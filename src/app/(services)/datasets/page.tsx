import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { localization } from '@/libs/language';

export default async function Datasets() {
  const pageContent = (
    <Alert data-color='info'>
      <Heading>{localization.info.datasetPrototypeIntro}</Heading>
      <Paragraph>{localization.info.datasetProtoypeInfo}</Paragraph>
    </Alert>
  );

  return (
    <SearchPage
      header={localization.tabs.datasets}
      searchLabel={localization.search.searchForDatasets}
      infoContent={
        <Alert data-color={'warning'} className='infoAlert' data-size={'md'}>
          Datasett er ikke klar for testing.
        </Alert>
      }
      searchResult={pageContent}
    ></SearchPage>
  );
}
