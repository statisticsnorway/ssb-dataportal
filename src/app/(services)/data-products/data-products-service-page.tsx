'use client';

import { parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { Suspense, useMemo } from 'react';
import { useAuthContext } from '@/app/authContext';
import { CheckboxFilter, FiltersPanel } from '@/components/filters';
import { FilterTagsSection } from '@/components/filters/filter-tags-section';
import { TextFilter } from '@/components/filters/text-filter';
import { SearchPage } from '@/components/search-page-wrapper/search-page';
import { SortFields } from '@/components/sort-fields';
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
  const { isAuthenticated } = useAuthContext();
  const [{ productTypes, subjects, q: textFilterValue, sort }, setQueryState] = useQueryStates({
    q: parseAsString.withDefault(''),
    sort: parseAsStringLiteral(['titleAsc', 'titleDesc']).withDefault('titleAsc'),
    productTypes: parseAsArrayOf(parseAsString).withDefault([]),
    subjects: parseAsArrayOf(parseAsString).withDefault([]),
  });

  const visibleDataProducts = useMemo(
    () => dataProducts.filter((dataProduct) => isAuthenticated || dataProduct.contains_valid_datasets !== false),
    [dataProducts, isAuthenticated],
  );

  const textFilteredDataProducts = useMemo(() => {
    const query = textFilterValue.trim().toLocaleLowerCase('nb');

    if (!query) return visibleDataProducts;

    return visibleDataProducts.filter(
      (dataProduct) =>
        dataProduct.product_short_name?.toLocaleLowerCase('nb').includes(query) ||
        dataProduct.title?.toLocaleLowerCase('nb').includes(query),
    );
  }, [visibleDataProducts, textFilterValue]);

  const productTypeFilters = useMemo<FilterItem[]>(() => {
    const counts = countByProductType(textFilteredDataProducts);

    return dataProductTypeOrder.map((productType) => ({
      label: getProductTypeLabel(productType),
      value: productType,
      count: counts[productType] ?? 0,
    }));
  }, [textFilteredDataProducts]);

  const subjectFieldFilters = useMemo<FilterItem[]>(() => {
    const counts = countProductsBySubjectField(textFilteredDataProducts);
    return subjectFields
      .filter((subjectField) => !subjectField.parentCode)
      .map((subjectField) => ({
        label: String(subjectField.name),
        value: String(subjectField.code),
        count: counts[String(subjectField.code)]?.size ?? 0,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, 'nb'));
  }, [textFilteredDataProducts, subjectFields]);

  const updateQuery = (update: Parameters<typeof setQueryState>[0]) =>
    setQueryState(update).catch((error) => {
      clientLogger.error('Failed to update query state', error);
    });

  const handleTextFilterChange = (value: string) => {
    updateQuery({ q: value || null });
  };

  const toggleSubject = (filter: FilterItem) => {
    const nextSubjects = toggleValue(subjects, filter.value);

    updateQuery({ subjects: nextSubjects.length > 0 ? nextSubjects : null });
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
        const subject = subjectFields.find((item) => String(item.code) === code);
        return { value: code, label: subject ? String(subject.name) : code };
      }),
    );
    return tags;
  }, [selectedProductTypeFilters, subjects, subjectFields]);

  const removeFilter = (tag: FilterItem) => {
    const nextProductTypes = productTypes.filter((value) => value !== tag.value);
    const nextSubjects = subjects.filter((value) => value !== tag.value);

    updateQuery({
      productTypes: nextProductTypes.length > 0 ? nextProductTypes : null,
      subjects: nextSubjects.length > 0 ? nextSubjects : null,
    });

    scrollToFilterTags();
  };

  const clearAll = async () => {
    await setQueryState({
      q: null,
      productTypes: null,
      subjects: null,
    });
    scrollToFilterTags();
  };

  const getDataProductTitle = (dataProduct: DataProductDTO): string =>
    dataProduct.title ?? dataProduct.product_short_name ?? '';

  const filteredDataProducts = useMemo(
    () =>
      textFilteredDataProducts
        .filter((dataProduct) => {
          const matchesProductType =
            productTypes.length === 0 || productTypes.includes(getProductTypeFilterValue(dataProduct));

          const matchesSubject =
            subjects.length === 0 || getSubjectFieldCodes(dataProduct).some((code) => subjects.includes(code));

          return matchesProductType && matchesSubject;
        })
        .toSorted((a, b) => {
          const comparison = getDataProductTitle(a).localeCompare(getDataProductTitle(b), 'nb-NO', {
            sensitivity: 'base',
          });

          return sort === 'titleDesc' ? -comparison : comparison;
        }),
    [textFilteredDataProducts, productTypes, subjects, sort],
  );

  const handleProductTypeFilterChange = (filter: FilterItem) => {
    const nextProductTypes = toggleValue(productTypes, filter.value);

    updateQuery({
      productTypes: nextProductTypes.length > 0 ? nextProductTypes : null,
    });
    scrollToFilterTags();
  };

  return (
    <DataProductsProvider
      dataProducts={visibleDataProducts}
      subjectFields={subjectFields}
      subjectFieldFilters={subjectFieldFilters}
      selectedSubjectCodes={subjects}
    >
      <SearchPage
        tabsId={tabsData.DataProducts.id}
        header={localization.tabs.dataProducts}
        totalHits={filteredDataProducts.length}
        infoContent={
          <FilterTagsSection
            tags={filterTags}
            onRemoveTag={removeFilter}
            onClearAll={clearAll}
            searchTerm={textFilterValue}
            onClearSearch={() => {
              updateQuery({ q: null });
              scrollToFilterTags();
            }}
          />
        }
        controlsContent={
          <SortFields
            sortOptions={['titleAsc', 'titleDesc']}
            sortValue={sort}
            onSortChange={(value: 'titleAsc' | 'titleDesc') => {
              updateQuery({ sort: value });
              scrollToFilterTags();
            }}
          />
        }
        asideContent={
          <FiltersPanel heading={localization.search.filter.label}>
            <TextFilter
              label={localization.search.textFilter.label}
              searchTerm={textFilterValue}
              setSearchTerm={handleTextFilterChange}
            />
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
                  key={dataProduct.product_short_name ?? dataProduct.title ?? `product-${index}`}
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
