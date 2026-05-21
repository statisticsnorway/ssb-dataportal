import { Heading } from '@digdir/designsystemet-react';
import { tabsData } from '@/app/(services)/tabs';
import { DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { DataProductDTO, DatasetDTO } from '@/libs/data-access/datadoc/models';
import { localization } from '@/libs/language';
import { getHomeBreadcrumb } from '@/utils/breadcrumbs';
import { DatasetSearchHit } from './components/DatasetSearchHit';
import styles from './page.module.css';

export default function DataProductDetail({
  dataProduct,
  datasets,
}: {
  dataProduct: DataProductDTO;
  datasets: DatasetDTO[];
}) {
  return (
    <div className={`${styles.detailsPage} container`}>
      <DataportalBreadcrumbs
        homeUrl={getHomeBreadcrumb()}
        items={[{ text: localization.tabs.dataProducts, href: tabsData.DataProducts.route }]}
        currentText={dataProduct.title ?? dataProduct.product_short_name ?? undefined}
      />

      <main className={styles.mainContent}>
        <Heading className={styles.detailsHeading} data-size='2xl' level={1}>
          {dataProduct.title ?? dataProduct.product_short_name}
        </Heading>

        <section>
          <Heading level={2} className={styles.sectionHeading}>
            Datasett
          </Heading>
          <div className={styles.datasetList}>
            {datasets.map((d) => (
              <DatasetSearchHit key={d.id ?? `${d.product_short_name}-${d.short_description}`} dataset={d} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
