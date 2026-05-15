import { Card, Heading, Link, Tag } from '@digdir/designsystemet-react';
import { type ReactNode } from 'react';

import { tabsData } from '@/app/(services)/tabs';
import { DataProductDTO } from '@/libs/data-access/datadoc/models';

import styles from './dataProduct.module.css';

interface HeadingLinkProps {
  href: string;
  children: ReactNode;
}

const HeadingLink = ({ href, children }: HeadingLinkProps) => (
  <Link href={href} className={styles.dataProductHeadingLink}>
    {children}
  </Link>
);

export const DataProductSearchHit = ({ dataProduct }: { dataProduct: DataProductDTO }) => {
  const dataProductRoute = `${tabsData.Datasets.route}/${dataProduct.product_short_name}`;

  return (
    <Card data-testid='data-product-search-card'>
      <Heading data-size='md' className={styles.dataProductHeadingLink}>
        <HeadingLink href={dataProductRoute}>
          <span className='heading12'>{dataProduct.title}</span>
        </HeadingLink>
      </Heading>
      <Tag>{dataProduct.product_short_name}</Tag>
    </Card>
  );
};
