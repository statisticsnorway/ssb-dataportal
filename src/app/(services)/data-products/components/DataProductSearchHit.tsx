import { Tag } from '@digdir/designsystemet-react';
import { tabsData } from '@/app/(services)/tabs';
import { SearchHit } from '@/components/search-hit';
import { DataProductDTO, DataProductType } from '@/libs/data-access/datadoc/models';
import { localization } from '@/libs/language';
import { KlassCode } from '@/types/klass-codes';
import { getParentCode } from '@/utils/functions';

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
  readonly subjectFields?: KlassCode[];
}

const getSubjectFieldLabel = (dataProduct: DataProductDTO, subjectFields: KlassCode[] = []) => {
  const subjectCode = dataProduct.subject_code?.trim();
  if (!subjectCode) return null;

  const parentCode = getParentCode(subjectCode);
  return (
    subjectFields.find((subjectField) => subjectField.code === parentCode && !subjectField.parentCode)?.name ?? null
  );
};

export const DataProductSearchHit = ({ dataProduct, subjectFields }: DataProductSearchHitProps) => {
  const dataProductRoute = `${tabsData.DataProducts.route}/${dataProduct.product_short_name}`;
  const subjectFieldLabel = getSubjectFieldLabel(dataProduct, subjectFields);

  const tagsList = (
    <>
      {subjectFieldLabel && <Tag aria-label={localization.subjectArea}>{subjectFieldLabel}</Tag>}
      {dataProduct.product_type && <Tag>{localizeDataProductType(dataProduct.product_type)}</Tag>}
    </>
  );

  return (
    <SearchHit
      href={dataProductRoute}
      title={dataProduct.title ?? dataProduct.product_short_name ?? ''}
      tagsList={tagsList}
    />
  );
};
