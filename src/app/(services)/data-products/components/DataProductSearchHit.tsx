import { Card, Heading, Link } from '@digdir/designsystemet-react';
import { type ReactNode } from 'react';

import { tabsData } from '@/app/(services)/tabs';
import { DataProductDTO } from '@/libs/data-access/datadoc/models';

import styles from './dataProduct.module.css';

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

export const DataProductSearchHit = ({ dataProduct }: DataProductSearchHitProps) => {
  const dataProductRoute = `${tabsData.DataProducts.route}/${dataProduct.product_short_name}`;

  return (
    <Card data-testid='data-product-search-card'>
      <Heading data-size='md' className={styles.dataProductHeadingLink}>
        <HeadingLink href={dataProductRoute}>
          <span className='heading12'>{dataProduct.product_short_name}</span>
        </HeadingLink>
      </Heading>
    </Card>
  );
};
