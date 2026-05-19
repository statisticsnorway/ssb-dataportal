import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import { Metadata } from 'next';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { listDataProducts } from '@/libs/data/datasets/datasets';
import { localization } from '@/libs/language';
import { createLogger } from '@/libs/logger/server-logger';
import { tabsData } from '../tabs';
import { DataProductSearchHit } from './components/DataProductSearchHit';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: localization.pageTitle.dataProducts,
};

export default async function Datasets({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const logger = createLogger('data-products-discover-page');
  logger.info({ params }, 'Data products page access');
  const dataProducts = await listDataProducts();
  const pageInfo = (
    <Alert data-color='info' data-size='lg'>
      <Heading level={2}>{localization.info.datasetPrototypeIntro}</Heading>
      <Paragraph>{localization.info.datasetProtoypeInfo}</Paragraph>
    </Alert>
  );

  return (
    <SearchPage
      tabsId={tabsData.DataProducts.id}
      header={localization.tabs.dataProducts}
      totalHits={dataProducts.length}
      infoContent={pageInfo}
      searchResult={
        <div className={styles.searchResultList}>
          {dataProducts.map((d, index) => (
            <DataProductSearchHit key={d.product_short_name || index} dataProduct={d} />
          ))}
        </div>
      }
    />
  );
}
