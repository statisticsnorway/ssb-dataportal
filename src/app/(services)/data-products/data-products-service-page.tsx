'use client';

import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '@/app/authContext';
import { CheckboxFilter, FiltersPanel } from '@/components/filters';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { doesDatasetHaveAnyValidFiles, listDatasetsByProductShortName } from '@/libs/data/datasets/datasets';
import { type DataProductDTO, DataProductType } from '@/libs/data-access/datadoc/models';
import { localization } from '@/libs/language';
import type { FilterItem } from '@/types/filters';
import { tabsData } from '../tabs';
import { DataProductSearchHit, localizeDataProductType } from './components/DataProductSearchHit';
import styles from './page.module.css';

interface DataProductsServicePageProps {
  readonly dataProducts: DataProductDTO[];
}

const UNKNOWN_PRODUCT_TYPE = 'UNKNOWN_PRODUCT_TYPE';

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

export const DataProductsServicePage = ({ dataProducts }: DataProductsServicePageProps) => {
  const [selectedProductTypeFilters, setSelectedProductTypeFilters] = useState<FilterItem[]>([]);

  const { isAuthenticated } = useAuthContext();
  const [visibleDataProducts, setVisibleDataProducts] = useState<DataProductDTO[]>(() => []);

  useEffect(() => {
    let cancelled = false;

    if (isAuthenticated) {
      setVisibleDataProducts(dataProducts);
      return;
    }

    const filterDataProducts = async () => {
      const hasValidDatasets = await Promise.all(
        dataProducts.map(async (dataProduct) => {
          if (!dataProduct.product_short_name) return false;
          const datasets = await listDatasetsByProductShortName(dataProduct.product_short_name);
          const hasAnyValidFiles = await Promise.all(
            datasets.map(async (dataset) => (dataset.id ? doesDatasetHaveAnyValidFiles(dataset.id) : false)),
          );
          return hasAnyValidFiles.some(Boolean);
        }),
      );

      if (!cancelled) {
        setVisibleDataProducts(dataProducts.filter((_, index) => hasValidDatasets[index]));
      }
    };

    void filterDataProducts();

    return () => {
      cancelled = true;
    };
  }, [dataProducts, isAuthenticated]);

  const productTypeFilters = useMemo<FilterItem[]>(() => {
    const counts = countByProductType(visibleDataProducts);
    return dataProductTypeOrder
      .filter((productType) => counts[productType] != null)
      .map((productType) => ({
        label: getProductTypeLabel(productType),
        value: productType,
        count: counts[productType],
      }));
  }, [visibleDataProducts]);

  const filteredDataProducts = useMemo(() => {
    const selectedProductTypes = new Set(selectedProductTypeFilters.map((filter) => filter.value));
    return visibleDataProducts.filter((dataProduct) => {
      const matchesProductType =
        selectedProductTypes.size === 0 || selectedProductTypes.has(getProductTypeFilterValue(dataProduct));
      return matchesProductType;
    });
  }, [visibleDataProducts, selectedProductTypeFilters]);

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
