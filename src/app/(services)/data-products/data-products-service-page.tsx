'use client';

import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import { useMemo, useState } from 'react';
import { CheckboxFilter, FiltersPanel } from '@/components/filters';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { type DataProductDTO, DataProductType, type DatasetDTO } from '@/libs/data-access/datadoc/models';
import { localization } from '@/libs/language';
import type { FilterItem } from '@/types/filters';
import { tabsData } from '../tabs';
import { DataProductSearchHit, localizeDataProductType } from './components/DataProductSearchHit';
import styles from './page.module.css';

interface DataProductsServicePageProps {
  readonly dataProducts: DataProductDTO[];
  readonly datasets?: DatasetDTO[];
}

const UNKNOWN_PRODUCT_TYPE = 'UNKNOWN_PRODUCT_TYPE';
const EMPTY_DATASETS: DatasetDTO[] = [];

type ProductTypeFilterValue = DataProductType | typeof UNKNOWN_PRODUCT_TYPE;

const dataProductTypeOrder: ProductTypeFilterValue[] = [
  DataProductType.STATISTIC_PRODUCT,
  DataProductType.OTHER_DATA_PRODUCT,
  UNKNOWN_PRODUCT_TYPE,
];

const getProductTypeFilterValue = (dataProduct: DataProductDTO): ProductTypeFilterValue => {
  return dataProduct.product_type ?? UNKNOWN_PRODUCT_TYPE;
};

const countByProductType = (dataProducts: DataProductDTO[]) => {
  return dataProducts.reduce<Record<string, number>>((counts, dataProduct) => {
    const productType = getProductTypeFilterValue(dataProduct);
    counts[productType] = (counts[productType] ?? 0) + 1;
    return counts;
  }, {});
};

const getProductTypeLabel = (productType: ProductTypeFilterValue) => {
  if (productType === UNKNOWN_PRODUCT_TYPE) return localization.products.unknown;
  return localizeDataProductType(productType);
};

export const DataProductsServicePage = ({ dataProducts, datasets = EMPTY_DATASETS }: DataProductsServicePageProps) => {
  const [selectedProductTypeFilters, setSelectedProductTypeFilters] = useState<FilterItem[]>([]);
  const productTypeFilters = useMemo<FilterItem[]>(() => {
    const counts = countByProductType(dataProducts);
    return dataProductTypeOrder
      .filter((productType) => counts[productType] != null)
      .map((productType) => ({
        label: getProductTypeLabel(productType),
        value: productType,
        count: counts[productType],
      }));
  }, [dataProducts]);

  const filteredDataProducts = useMemo(() => {
    const selectedProductTypes = new Set(selectedProductTypeFilters.map((filter) => filter.value));
    return dataProducts.filter((dataProduct) => {
      const matchesProductType =
        selectedProductTypes.size === 0 || selectedProductTypes.has(getProductTypeFilterValue(dataProduct));
      return matchesProductType;
    });
  }, [dataProducts, datasets, selectedProductTypeFilters]);

  const handleProductTypeFilterChange = (filter: FilterItem) => {
    setSelectedProductTypeFilters((selectedFilters) => {
      if (selectedFilters.some((selectedFilter) => selectedFilter.value === filter.value)) {
        return selectedFilters.filter((selectedFilter) => selectedFilter.value !== filter.value);
      }
      return [...selectedFilters, filter];
    });
  };

  const pageInfo = (
    <Alert data-color='info'>
      <Heading level={2} className='infoHeadingSecondary'>
        {localization.info.datasetPrototypeIntro}
      </Heading>
      <Paragraph>{localization.info.datasetProtoypeInfo}</Paragraph>
    </Alert>
  );

  return (
    <SearchPage
      tabsId={tabsData.DataProducts.id}
      header={localization.tabs.dataProducts}
      totalHits={filteredDataProducts.length}
      infoContent={pageInfo}
      asideContent={
        <FiltersPanel>
          <CheckboxFilter
            filterHeading={localization.products.typeFilterLabel}
            filters={productTypeFilters}
            selectedItems={selectedProductTypeFilters}
            onFilterChange={handleProductTypeFilterChange}
          />
        </FiltersPanel>
      }
      searchResult={
        filteredDataProducts.length === 0 ? (
          <div>{localization.search.noHits}</div>
        ) : (
          <div className={styles.searchResultList}>
            {filteredDataProducts.map((dataProduct, index) => (
              <DataProductSearchHit key={dataProduct.product_short_name || index} dataProduct={dataProduct} />
            ))}
          </div>
        )
      }
    />
  );
};
