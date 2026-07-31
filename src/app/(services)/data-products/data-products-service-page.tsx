'use client';

import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';
import { Suspense, useMemo } from 'react';
import { CheckboxFilter, FiltersPanel } from '@/components/filters';
import { FilterTagsSection } from '@/components/filters/filter-tags-section';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { type DataProductDTO, DataProductType } from '@/libs/data-access/datadoc/models';
import { localization } from '@/libs/language';
import { clientLogger } from '@/libs/logger/client-logger';
import type { FilterItem } from '@/types/filters';
import { KlassCode } from '@/types/klass-codes';
import { getParentCode } from '@/utils/functions';
import { scrollToFilterTags } from '@/utils/scrollToFilterTags';
import { tabsData } from '../tabs';
import { DataProductSearchHit, localizeDataProductType } from './components/DataProductSearchHit';
import { DataProductsProvider } from './components/dataProductsContext';
import { SubjectFiltersSection, SubjectFiltersSectionFallback } from './components/SubjectFiltersSection';
import styles from './page.module.css';

interface DataProductsServicePageProps {
  readonly dataProducts: DataProductDTO[];
  readonly subjectFields?: KlassCode[];
}

const UNKNOWN_PRODUCT_TYPE = 'UNKNOWN_PRODUCT_TYPE';
const EMPTY_SUBJECT_FIELDS: KlassCode[] = [];

type ProductTypeFilterValue = DataProductType | typeof UNKNOWN_PRODUCT_TYPE;

const dataProductTypeOrder: ProductTypeFilterValue[] = [
  DataProductType.STATISTIC_PRODUCT,
  DataProductType.OTHER_DATA_PRODUCT,
  UNKNOWN_PRODUCT_TYPE,
];

const toggleValue = (values: string[], nextValue: string): string[] => {
  return values.includes(nextValue) ? values.filter((value) => value !== nextValue) : [...values, nextValue];
};

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
  const [{ productTypes, subjects }, setQueryState] = useQueryStates({
    productTypes: parseAsArrayOf(parseAsString).withDefault([]),
    subjects: parseAsArrayOf(parseAsString).withDefault([]),
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
      .sort((a, b) => a.label.localeCompare(b.label, 'nb'));
  }, [dataProducts, subjectFields]);

  const updateQuery = (update: Parameters<typeof setQueryState>[0]) =>
    setQueryState(update).catch((error) => {
      clientLogger.error('Failed to update query state', error);
    });

  const toggleSubject = (filter: FilterItem) => {
    const nextSubjects = toggleValue(subjects, filter.value);

    updateQuery({ subjects: nextSubjects.length > 0 ? nextSubjects : null, page: 1 });
    scrollToFilterTags();
  };

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

    tags.push(
      ...subjects.map((code) => {
        const subject = subjectFields?.find((item) => String(item.code) === code);
        return { value: code, label: subject ? String(subject.name) : code };
      }),
    );
    return tags;
  }, [selectedProductTypeFilters, subjects, subjectFields]);

  const removeFilter = async (tag: FilterItem) => {
    const nextProductTypes = productTypes.filter((v) => v !== tag.value);
    const nextSubjects = subjects.filter((value) => value !== tag.value);

    await setQueryState({
      productTypes: nextProductTypes.length > 0 ? nextProductTypes : null,
      subjects: nextSubjects.length > 0 ? nextSubjects : null,
    });
    scrollToFilterTags();
  };

  const clearAll = async () => {
    await setQueryState({
      productTypes: null,
      subjects: null,
    });
    scrollToFilterTags();
  };

  const filteredDataProducts = useMemo(() => {
    const selectedProductTypes = new Set(productTypes);
    const selectedSubjectFields = new Set(subjects);

    return dataProducts.filter((dataProduct) => {
      const matchesProductType =
        selectedProductTypes.size === 0 || selectedProductTypes.has(getProductTypeFilterValue(dataProduct));

      const subjectFieldCodes = getSubjectFieldCodes(dataProduct);
      const matchesSubjectField =
        selectedSubjectFields.size === 0 || subjectFieldCodes.some((code) => selectedSubjectFields.has(code));

      return matchesProductType && matchesSubjectField;
    });
  }, [dataProducts, productTypes, subjects]);

  const handleProductTypeFilterChange = (filter: FilterItem) => {
    const nextProductTypes = productTypes.includes(filter.value)
      ? productTypes.filter((value) => value !== filter.value)
      : [...productTypes, filter.value];
    setQueryState({ productTypes: nextProductTypes.length > 0 ? nextProductTypes : null }).then(() => {
      scrollToFilterTags();
    });
  };

  const pageInfo = (
    <Alert data-color='info'>
      <Heading level={2} className='infoHeadingSecondary'>
        {localization.info.datasetPrototypeIntro}
      </Heading>
      <Paragraph>{localization.info.datasetPrototypeInfo}</Paragraph>
    </Alert>
  );

  return (
    <DataProductsProvider
      dataProducts={dataProducts}
      subjectFields={subjectFields}
      subjectFieldFilters={subjectFieldFilters}
      selectedSubjectCodes={subjects}
    >
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
            <Suspense fallback={<SubjectFiltersSectionFallback />}>
              <SubjectFiltersSection onFilterChange={toggleSubject} />
            </Suspense>
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
    </DataProductsProvider>
  );
};
