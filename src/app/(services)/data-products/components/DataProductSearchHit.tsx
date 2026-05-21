import { Card, Heading, Link, Tag } from "@digdir/designsystemet-react";
import { type ReactNode } from "react";

import { tabsData } from "@/app/(services)/tabs";
import { DataProductDTO, DataProductType } from "@/libs/data-access/datadoc/models";

import styles from "./dataProduct.module.css";
import { localization } from "@/libs/language";

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
}

export const DataProductSearchHit = ({
  dataProduct,
}: DataProductSearchHitProps) => {
  const dataProductRoute = `${tabsData.DataProducts.route}/${dataProduct.product_short_name}`;

  return (
    <Card data-testid="data-product-search-card">
      <Heading data-size="md" className={styles.dataProductHeadingLink}>
        <HeadingLink href={dataProductRoute}>
          <span className="heading12">
            {dataProduct.title ?? dataProduct.product_short_name}
          </span>
        </HeadingLink>
      </Heading>
      {<Tag> {localizeDataProductType(dataProduct.product_type)}</Tag>}
    </Card>
  );
};
