import { Alert } from '@digdir/designsystemet-react';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { localization } from '@/libs/language';

export default async function Datasets() {
  const pageContent = <div>{localization.info.datasetPrototypeIntro}</div>;
  return (
    <SearchPage
      header={localization.tabs.datasets}
      searchLabel='Søk i datasett'
      infoContent={
        <Alert data-color={'warning'} className='infoAlert' data-size={'md'}>
          Datasett er ikke klar for testing.
        </Alert>
      }
      searchResult={pageContent}
    ></SearchPage>
  );
}
