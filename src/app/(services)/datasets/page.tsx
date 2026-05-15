import { Metadata } from 'next';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { listDataProducts } from '@/libs/data/datasets/datasets';
import { localization } from '@/libs/language';
import { tabsData } from '../tabs';
import { DataProductSearchHit } from './components/DataProductSearchHit';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: localization.pageTitle.dataProducts,
};

export default async function Datasets() {
  const dataProducts = await listDataProducts();

  return (
    <SearchPage
      tabsId={tabsData.Datasets.id}
      header={localization.tabs.datasets}
      totalHits={dataProducts.length}
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
