import { Tag } from '@digdir/designsystemet-react';
import { tabsData } from '@/app/(services)/tabs';
import { SearchHit } from '@/components/search-hit';
import { DataProductDTO, DataProductType } from '@/libs/data-access/datadoc/models';
import { localization } from '@/libs/language';

export const localizeDataProductType = (it: DataProductType | null | undefined) => {
  switch (it) {
    case DataProductType.OTHER_DATA_PRODUCT:
      return localization.products.other;
    case DataProductType.STATISTIC_PRODUCT:
      return localization.products.statistic;
    case undefined:
    case null:
      return localization.products.unknown;
    default:
      it satisfies never;
  }
};

interface DataProductSearchHitProps {
  readonly dataProduct: DataProductDTO;
}

export const DataProductSearchHit = ({ dataProduct }: DataProductSearchHitProps) => {
  const dataProductRoute = `${tabsData.DataProducts.route}/${dataProduct.product_short_name}`;

  return (
    <SearchHit
      href={dataProductRoute}
      title={dataProduct.title ?? dataProduct.product_short_name ?? ''}
      tagsList={dataProduct.product_type && <Tag>{localizeDataProductType(dataProduct.product_type)}</Tag>}
    />
  );
};
