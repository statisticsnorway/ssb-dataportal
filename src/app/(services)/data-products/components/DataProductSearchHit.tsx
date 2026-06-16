import { Card, Heading, Link, Tag } from '@digdir/designsystemet-react';
import { type ReactNode } from 'react';

import { tabsData } from '@/app/(services)/tabs';
import { DataProductDTO, DataProductType } from '@/libs/data-access/datadoc/models';
import type { CodeItem } from '@/libs/data-access/klass/models';
import { localization } from '@/libs/language';
import { getParentCode } from '@/utils/functions';
import styles from './dataProduct.module.css';

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

interface HeadingLinkProps {
  readonly href: string;
  readonly children: ReactNode;
}

const HeadingLink = ({ href, children }: HeadingLinkProps) => (
  <Link href={href} className={styles.dataProductHeadingLink}>
    {children}
  </Link>
);

interface DataProductSearchHitProps {
  readonly dataProduct: DataProductDTO;
  readonly subjectFields?: CodeItem[];
}

const getSubjectFieldLabel = (dataProduct: DataProductDTO, subjectFields: CodeItem[] = []) => {
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

  return (
    <Card data-testid='data-product-search-card'>
      <Heading data-size='md' className={styles.dataProductHeadingLink}>
        <HeadingLink href={dataProductRoute}>
          <span className='primaryHeading'>{dataProduct.title ?? dataProduct.product_short_name}</span>
        </HeadingLink>
      </Heading>
      <div className={styles.tagsList}>
        {subjectFieldLabel && <Tag aria-label={localization.subjectArea}>{subjectFieldLabel}</Tag>}
        {dataProduct.product_type && <Tag>{localizeDataProductType(dataProduct.product_type)}</Tag>}
      </div>
    </Card>
  );
};
