import { Card, Heading, Link, Tag } from '@digdir/designsystemet-react';
import { tabsData } from '@/app/(services)/tabs';
import { DataProductDTO } from '@/libs/data-access/datadoc/models';

import styles from './dataProduct.module.css';

export const DataProductSearchHit = ({ dataProduct }: { dataProduct: DataProductDTO }) => (
  <Card>
    <Heading data-size='md'>
      <Link
        href={`${tabsData.Datasets.route}/${dataProduct.product_short_name}`}
        className={styles.dataProductHeadingLink}
      >
        {dataProduct.title}
      </Link>
    </Heading>
    <div className={styles.tagContainer}>
      <Tag data-color='success' data-size='md'>
        {dataProduct.product_short_name}
      </Tag>
    </div>
  </Card>
);
