'use client';

import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import { useMemo, useState } from 'react';
import { CheckboxFilter, FiltersPanel } from '@/components/filters';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { Assessment, type DataProductDTO, DataProductType, type DatasetDTO } from '@/libs/data-access/datadoc/models';
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
const UNKNOWN_ASSESSMENT = 'UNKNOWN_ASSESSMENT';
const EMPTY_DATASETS: DatasetDTO[] = [];

type ProductTypeFilterValue = DataProductType | typeof UNKNOWN_PRODUCT_TYPE;
type AssessmentFilterValue = Assessment | typeof UNKNOWN_ASSESSMENT | (string & {});

const dataProductTypeOrder: ProductTypeFilterValue[] = [
  DataProductType.STATISTIC_PRODUCT,
  DataProductType.OTHER_DATA_PRODUCT,
  UNKNOWN_PRODUCT_TYPE,
];

const knownAssessmentOrder: AssessmentFilterValue[] = [Assessment.OPEN, Assessment.PROTECTED, Assessment.SENSITIVE];

const getProductTypeFilterValue = (dataProduct: DataProductDTO): ProductTypeFilterValue => {
  return dataProduct.product_type ?? UNKNOWN_PRODUCT_TYPE;
};

const getAssessmentFilterValue = (dataset: DatasetDTO): AssessmentFilterValue => {
  return dataset.assessment ?? UNKNOWN_ASSESSMENT;
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

const countProductsByAssessment = (dataProducts: DataProductDTO[], datasets: DatasetDTO[]) => {
  const productShortNames = new Set(dataProducts.map((dataProduct) => dataProduct.product_short_name).filter(Boolean));
  return datasets.reduce<Record<string, Set<string>>>((counts, dataset) => {
    if (!dataset.product_short_name || !productShortNames.has(dataset.product_short_name)) return counts;
    const assessment = getAssessmentFilterValue(dataset);
    counts[assessment] = (counts[assessment] ?? new Set()).add(dataset.product_short_name);
    return counts;
  }, {});
};

const getAssessmentLabel = (assessment: AssessmentFilterValue) => {
  switch (assessment) {
    case Assessment.OPEN:
      return localization.products.assessment.open;
    case Assessment.PROTECTED:
      return localization.products.assessment.protected;
    case Assessment.SENSITIVE:
      return localization.products.assessment.sensitive;
    case UNKNOWN_ASSESSMENT:
      return localization.products.assessment.unknown;
    default:
      return assessment
        .toLowerCase()
        .replaceAll('_', ' ')
        .replace(/^./, (firstCharacter) => firstCharacter.toUpperCase());
  }
};

const getAssessmentFilterOrder = (counts: Record<string, Set<string>>) => {
  const knownAssessmentValues = new Set(knownAssessmentOrder);
  const knownValues = knownAssessmentOrder.filter((assessment) => counts[assessment] != null);
  const additionalValues = Object.keys(counts)
    .filter((assessment) => !knownAssessmentValues.has(assessment) && assessment !== UNKNOWN_ASSESSMENT)
    .sort((a, b) => getAssessmentLabel(a).localeCompare(getAssessmentLabel(b), 'nb'));
  if (counts[UNKNOWN_ASSESSMENT] == null) return [...knownValues, ...additionalValues];
  return [...knownValues, ...additionalValues, UNKNOWN_ASSESSMENT];
};

export const DataProductsServicePage = ({ dataProducts, datasets = EMPTY_DATASETS }: DataProductsServicePageProps) => {
  const [selectedProductTypeFilters, setSelectedProductTypeFilters] = useState<FilterItem[]>([]);
  const [selectedAssessmentFilters, setSelectedAssessmentFilters] = useState<FilterItem[]>([]);
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

  const assessmentFilters = useMemo<FilterItem[]>(() => {
    const counts = countProductsByAssessment(dataProducts, datasets);
    return getAssessmentFilterOrder(counts).map((assessment) => ({
      label: getAssessmentLabel(assessment),
      value: assessment,
      count: counts[assessment]?.size,
    }));
  }, [dataProducts, datasets]);

  const filteredDataProducts = useMemo(() => {
    const selectedProductTypes = new Set(selectedProductTypeFilters.map((filter) => filter.value));
    const selectedAssessments = new Set(selectedAssessmentFilters.map((filter) => filter.value));
    return dataProducts.filter((dataProduct) => {
      const matchesProductType =
        selectedProductTypes.size === 0 || selectedProductTypes.has(getProductTypeFilterValue(dataProduct));
      const matchesAssessment =
        selectedAssessments.size === 0 ||
        datasets.some(
          (dataset) =>
            dataset.product_short_name === dataProduct.product_short_name &&
            selectedAssessments.has(getAssessmentFilterValue(dataset)),
        );
      return matchesProductType && matchesAssessment;
    });
  }, [dataProducts, datasets, selectedAssessmentFilters, selectedProductTypeFilters]);

  const handleProductTypeFilterChange = (filter: FilterItem) => {
    setSelectedProductTypeFilters((selectedFilters) => {
      if (selectedFilters.some((selectedFilter) => selectedFilter.value === filter.value)) {
        return selectedFilters.filter((selectedFilter) => selectedFilter.value !== filter.value);
      }
      return [...selectedFilters, filter];
    });
  };

  const handleAssessmentFilterChange = (filter: FilterItem) => {
    setSelectedAssessmentFilters((selectedFilters) => {
      if (selectedFilters.some((selectedFilter) => selectedFilter.value === filter.value)) {
        return selectedFilters.filter((selectedFilter) => selectedFilter.value !== filter.value);
      }
      return [...selectedFilters, filter];
    });
  };

  const pageInfo = (
    <Alert data-color='info'>
      <Heading level={2}>{localization.info.datasetPrototypeIntro}</Heading>
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
          <CheckboxFilter
            filterHeading={localization.products.assessment.filterLabel}
            filters={assessmentFilters}
            selectedItems={selectedAssessmentFilters}
            onFilterChange={handleAssessmentFilterChange}
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
