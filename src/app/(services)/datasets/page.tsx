import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { localization } from '@/libs/language';

export default async function Datasets() {
  const pageInfo = (
    <Alert data-color='info' data-size='lg'>
      <Heading level={2}>{localization.info.datasetPrototypeIntro}</Heading>
      <Paragraph>{localization.info.datasetProtoypeInfo}</Paragraph>
    </Alert>
  );

  return <SearchPage header={localization.tabs.datasets} searchResult={pageInfo}></SearchPage>;
}
