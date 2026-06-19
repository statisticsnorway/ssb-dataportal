'use client';

import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';
import { useMemo } from 'react';
import { CheckboxFilter, FiltersPanel, SelectFilter } from '@/components/filters';
import { FilterTagsSection } from '@/components/filters/filter-tags-section';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { type DataProductDTO, DataProductType } from '@/libs/data-access/datadoc/models';
import type { CodeItem } from '@/libs/data-access/klass/models';
import { localization } from '@/libs/language';
import type { FilterItem } from '@/types/filters';
import { getParentCode } from '@/utils/functions';
import { tabsData } from '../tabs';
import { DataProductSearchHit, localizeDataProductType } from './components/DataProductSearchHit';
import styles from './page.module.css';

interface DataProductsServicePageProps {
  readonly dataProducts: DataProductDTO[];
  readonly subjectFields?: CodeItem[];
}

const UNKNOWN_PRODUCT_TYPE = 'UNKNOWN_PRODUCT_TYPE';
const ALL_SUBJECT_FIELDS = '';
const EMPTY_SUBJECT_FIELDS: CodeItem[] = [];

type ProductTypeFilterValue = DataProductType | typeof UNKNOWN_PRODUCT_TYPE;

const dataProductTypeOrder: ProductTypeFilterValue[] = [
  DataProductType.STATISTIC_PRODUCT,
  DataProductType.OTHER_DATA_PRODUCT,
  UNKNOWN_PRODUCT_TYPE,
];

const getProductTypeFilterValue = (dataProduct: DataProductDTO): ProductTypeFilterValue => {
  return dataProduct.product_type ?? UNKNOWN_PRODUCT_TYPE;
};

const getSubjectFieldCodes = (dataProduct: DataProductDTO) => {
  const subjectCode = dataProduct.subject_code?.trim();
  return subjectCode ? [getParentCode(subjectCode)] : [];
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

const countProductsBySubjectField = (dataProducts: DataProductDTO[]) => {
  return dataProducts.reduce<Record<string, Set<string>>>((counts, dataProduct, index) => {
    const productKey = dataProduct.product_short_name ?? String(index);
    const subjectFieldCodes = new Set(getSubjectFieldCodes(dataProduct));
    subjectFieldCodes.forEach((code) => {
      counts[code] = (counts[code] ?? new Set()).add(productKey);
    });
    return counts;
  }, {});
};

export const DataProductsServicePage = ({
  dataProducts,
  subjectFields = EMPTY_SUBJECT_FIELDS,
}: DataProductsServicePageProps) => {
  const [{ productTypes, subject }, setQueryState] = useQueryStates({
    productTypes: parseAsArrayOf(parseAsString).withDefault([]),
    subject: parseAsString.withDefault(ALL_SUBJECT_FIELDS),
  });

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

  const subjectFieldFilters = useMemo<FilterItem[]>(() => {
    const counts = countProductsBySubjectField(dataProducts);
    return subjectFields
      .filter((subjectField) => !subjectField.parentCode)
      .map((subjectField) => ({
        label: String(subjectField.name),
        value: String(subjectField.code),
        count: counts[String(subjectField.code)]?.size ?? 0,
      }))
      .filter((subjectField) => subjectField.count > 0)
      .sort((a, b) => a.label.localeCompare(b.label, 'nb'));
  }, [dataProducts, subjectFields]);

  const selectedProductTypeFilters = useMemo<FilterItem[]>(
    () =>
      productTypes.map((value) => {
        const filter = productTypeFilters.find((item) => item.value === value);
        return {
          label: filter?.label ?? value,
          value,
        };
      }),
    [productTypeFilters, productTypes],
  );

  const filterTags = useMemo<FilterItem[]>(() => {
    const tags = [...selectedProductTypeFilters];
    if (subject && subject !== ALL_SUBJECT_FIELDS) {
      const field = subjectFields.find((f) => String(f.code) === subject);
      tags.push({ value: subject, label: field ? String(field.name) : subject });
    }
    return tags;
  }, [selectedProductTypeFilters, subject, subjectFields]);

  const removeFilter = async (tag: FilterItem) => {
    const nextProductTypes = productTypes.filter((v) => v !== tag.value);
    const nextSubject = tag.value === subject ? ALL_SUBJECT_FIELDS : subject;

    await setQueryState({
      productTypes: nextProductTypes.length > 0 ? nextProductTypes : null,
      subject: nextSubject || null,
    });
  };

  const clearAll = async () => {
    await setQueryState({
      productTypes: null,
      subject: null,
    });
  };

  const filteredDataProducts = useMemo(() => {
    const selectedProductTypes = new Set(productTypes);
    return dataProducts.filter((dataProduct) => {
      const matchesProductType =
        selectedProductTypes.size === 0 || selectedProductTypes.has(getProductTypeFilterValue(dataProduct));
      const matchesSubjectField = subject === ALL_SUBJECT_FIELDS || getSubjectFieldCodes(dataProduct).includes(subject);
      return matchesProductType && matchesSubjectField;
    });
  }, [dataProducts, productTypes, subject]);

  const handleProductTypeFilterChange = (filter: FilterItem) => {
    const nextProductTypes = productTypes.includes(filter.value)
      ? productTypes.filter((value) => value !== filter.value)
      : [...productTypes, filter.value];
    void setQueryState({ productTypes: nextProductTypes.length > 0 ? nextProductTypes : null });
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
      banner={pageInfo}
      tabsId={tabsData.DataProducts.id}
      header={localization.tabs.dataProducts}
      totalHits={filteredDataProducts.length}
      infoContent={<FilterTagsSection tags={filterTags} onRemoveTag={removeFilter} onClearAll={clearAll} />}
      asideContent={
        <FiltersPanel heading={localization.search.filter.label}>
          <CheckboxFilter
            filterHeading={localization.products.typeFilterLabel}
            filters={productTypeFilters}
            selectedItems={selectedProductTypeFilters}
            onFilterChange={handleProductTypeFilterChange}
          />
          <SelectFilter
            id='data-product-subject-field-filter'
            filterHeading={localization.subjectArea}
            filters={subjectFieldFilters}
            selectedValue={subject}
            defaultOptionLabel='Alle statistikkområder'
            defaultOptionValue={ALL_SUBJECT_FIELDS}
            onFilterChange={(value) => void setQueryState({ subject: value || null })}
          />
        </FiltersPanel>
      }
      searchResult={
        filteredDataProducts.length === 0 ? (
          <div>{localization.search.noHits}</div>
        ) : (
          <div className={styles.searchResultList}>
            {filteredDataProducts.map((dataProduct, index) => (
              <DataProductSearchHit
                key={dataProduct.product_short_name || index}
                dataProduct={dataProduct}
                subjectFields={subjectFields}
              />
            ))}
          </div>
        )
      }
    />
  );
};
