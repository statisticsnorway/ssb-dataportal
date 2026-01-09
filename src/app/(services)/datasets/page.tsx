import { Alert } from '@digdir/designsystemet-react';
import SearchPage from '@/components/search-page-wrapper/search-page/searchPage';

export default async function Datasets() {
  return (
    <SearchPage
      filterGroups={[]}
      searchLabel='Søk i datasett'
      infoContent={
        <Alert data-color={'warning'} className='infoAlert' data-size={'md'}>
          Datasett er ikke klar for testing.
        </Alert>
      }
    ></SearchPage>
  );
}
